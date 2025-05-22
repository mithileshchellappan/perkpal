import { supabase } from '@/lib/supabase';
import { getCardLatestOffers } from '@/lib/services/perplexityService';
import { isTitleSimilar, levenshteinDistance } from '@/lib/utils/string-similarity';

// Function to update notifications
export async function updateNotifications() {
  try {
    // Fetch all distinct card types across all users
    const { data: cardTypes, error: cardError } = await supabase
      .from('user_cards')
      .select('bank, card_name, country')
      .order('bank', { ascending: true })
      .order('card_name', { ascending: true });

    if (cardError) {
      console.error('Error fetching card types:', cardError);
      return {
        success: false,
        message: 'Failed to fetch card types',
      };
    }

    // Create a unique set of card types
    const uniqueCardTypes = Array.from(
      new Map(
        cardTypes.map(card => [`${card.bank}-${card.card_name}`, card])
      ).values()
    );

    console.log(`Processing ${uniqueCardTypes.length} unique card types for notifications`);
    
    const results = {
      processed: 0,
      newNotifications: 0,
      errors: 0,
      userNotificationsCreated: 0
    };

    // Process each card type
    for (const cardType of uniqueCardTypes) {
      try {
        results.processed++;
        
        // Query Perplexity for updates
        const offers = await getCardLatestOffers(cardType.card_name, cardType.bank, cardType.country);
        
        if (!offers || !Array.isArray(offers) || offers.length === 0) {
          continue;
        }
        
        // Process each offer
        for (const offer of offers) {
          try {
            // Check if similar notification already exists using direct query
            const { data: similarNotifications, error: similarError } = await supabase
              .from('notifications')
              .select('id, title')
              .eq('card_issuer', cardType.bank)
              .eq('card_name', cardType.card_name)
              .eq('notification_type', offer.type)
              .order('created_at', { ascending: false })
              .limit(5); // Get the most recent similar notifications
            
            if (similarError) {
              console.error('Error checking for similar notifications:', similarError);
              results.errors++;
              continue;
            }
            
            // Check for similar titles using string similarity
            let existingId: string | null = null;
            if (similarNotifications && similarNotifications.length > 0) {
              for (const notification of similarNotifications) {
                // If titles are very similar, consider it a duplicate
                if (isTitleSimilar(notification.title, offer.title)) {
                  existingId = notification.id;
                  break;
                }
              }
            }
            
            let notificationId: string;
            
            // If no similar notification exists, create a new one
            if (!existingId) {
              const { data: newNotification, error: insertError } = await supabase
                .from('notifications')
                .insert({
                  card_issuer: cardType.bank,
                  card_name: cardType.card_name,
                  notification_type: offer.type,
                  title: offer.title,
                  description: offer.description,
                  start_date: new Date(offer.start_date),
                  end_date: offer.end_date ? new Date(offer.end_date) : null
                })
                .select('id')
                .single();
              
              if (insertError) {
                console.error('Error creating notification:', insertError);
                results.errors++;
                continue;
              }
              
              notificationId = newNotification.id;
              results.newNotifications++;
            } else {
              notificationId = existingId;
            }
            
            // Link notification to all users who have this card type
            const { data: userCards, error: userCardsError } = await supabase
              .from('user_cards')
              .select('user_id')
              .eq('bank', cardType.bank)
              .eq('card_name', cardType.card_name);
            
            if (userCardsError) {
              console.error('Error fetching users with card type:', userCardsError);
              results.errors++;
              continue;
            }
            
            // Create user_notifications entries (ignoring duplicates)
            for (const userCard of userCards) {
              // First check if entry already exists
              const { data: existingUserNotification, error: checkError } = await supabase
                .from('user_notifications')
                .select('id')
                .eq('user_id', userCard.user_id)
                .eq('notification_id', notificationId)
                .maybeSingle();
              
              if (checkError) {
                console.error('Error checking existing user notification:', checkError);
                continue;
              }
              
              // If not exists, create it
              if (!existingUserNotification) {
                const { error: linkError } = await supabase
                  .from('user_notifications')
                  .insert({
                    user_id: userCard.user_id,
                    notification_id: notificationId,
                    read: false
                  });
                
                if (!linkError) {
                  results.userNotificationsCreated++;
                }
              }
            }
          } catch (offerError) {
            console.error('Error processing offer:', offerError);
            results.errors++;
          }
        }
      } catch (cardError) {
        console.error(`Error processing card ${cardType.bank} ${cardType.card_name}:`, cardError);
        results.errors++;
      }
    }
    
    console.log('Notification update completed', results);
    return {
      success: true,
      message: 'Notifications update completed',
      results
    };
  } catch (error) {
    console.error('Unexpected error in notifications update job:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
} 