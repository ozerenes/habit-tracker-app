import { Redirect } from 'expo-router';
import { ROUTES } from '@/navigation/routes';

export default function Index() {
  return <Redirect href={ROUTES.TABS.HOME} />;
}
