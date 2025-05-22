/**
 * Check if two titles are similar using various string comparison methods
 * @param title1 First title to compare
 * @param title2 Second title to compare
 * @returns boolean indicating if titles are similar
 */
export function isTitleSimilar(title1: string, title2: string): boolean {
  // Convert both titles to lowercase for case-insensitive comparison
  const t1 = title1.toLowerCase().trim();
  const t2 = title2.toLowerCase().trim();
  
  // Exact match
  if (t1 === t2) return true;
  
  // Check if one is a substring of the other
  if (t1.includes(t2) || t2.includes(t1)) return true;
  
  // Count matching words (simple approach)
  const words1 = t1.split(/\s+/);
  const words2 = t2.split(/\s+/);
  
  let matchingWords = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matchingWords++;
    }
  }
  
  // If more than 70% of the words match (for titles with multiple words)
  if (words1.length >= 3 && words2.length >= 3) {
    return (matchingWords / Math.min(words1.length, words2.length)) > 0.7;
  }
  
  // For shorter titles, check edit distance
  return levenshteinDistance(t1, t2) / Math.max(t1.length, t2.length) < 0.3; // Less than 30% different
}

/**
 * Calculate Levenshtein distance between two strings
 * This represents the minimum number of single-character edits required to change one string into another
 * @param str1 First string
 * @param str2 Second string
 * @returns The edit distance between the strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix of size (m+1) x (n+1)
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Initialize the first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = Math.min(
          dp[i-1][j] + 1,  // deletion
          dp[i][j-1] + 1,  // insertion
          dp[i-1][j-1] + 1 // substitution
        );
      }
    }
  }
  
  return dp[m][n];
} 