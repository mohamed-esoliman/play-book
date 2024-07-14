import Auth from '../../components/Auth';

export const metadata = {
  title: 'Authentication - Play-Book',
  description: 'Sign in or sign up to Play-Book',
}

export default function AuthPage() {
  return (
    <div>
      <h1>Authentication</h1>
      <Auth />
    </div>
  );
}