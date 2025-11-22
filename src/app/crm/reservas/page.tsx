import ReservasBoardClient from '@/components/crm/ReservasBoardClient';

export const metadata = {
  title: 'Reservas | CRM',
  description: 'Pipeline de reservas',
};

export const dynamic = 'force-dynamic';

export default function ReservasPage() {
  return <ReservasBoardClient />;
}
