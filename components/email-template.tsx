// components/email-template-server.tsx
export default function EmailTemplate(
    { firstName }: { firstName: string }, 
    { resetUrl }: { resetUrl: string }) {
  return (
    <div>
      <p>Hello {firstName}, click the link below to reset your password:</p>
      <a href={resetUrl} style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Reset Password
      </a>
    </div>
  );
}
