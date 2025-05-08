import { SignIn } from "@clerk/nextjs";
import styles from "@/app/authStyles.module.css"; // Optional: for custom styling

export default function Page() {
  return (
    <div className={styles.authContainer}>
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
} 