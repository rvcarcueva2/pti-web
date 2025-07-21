import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - PTI',
  description: 'Reset your PTI account password',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
