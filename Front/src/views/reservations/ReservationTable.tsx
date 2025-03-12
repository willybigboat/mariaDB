import { useEffect, useState } from 'react';
import { getReservationsList } from '../../utils/fetch';
import { Reservation, ReservationQueryParams } from '../../interfaces/Reservation';
import '../../styles/ReservationTable.css';

interface ReservationTableProps {
  filters: ReservationQueryParams;
}

const ReservationTable = ({ filters }: ReservationTableProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await getReservationsList(filters);
        if (response.error) {
          setError(response.error);
          setReservations([]);
        } else {
          setReservations(response.data || []);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || '獲取預約列表失敗');
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [filters]);

  // 格式化日期時間
  const formatDateTime = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-spinner">載入預約資料中...</div>;
  }

  if (error) {
    return <div className="error-message">錯誤: {error}</div>;
  }

  if (reservations.length === 0) {
    return <div className="no-data">沒有找到符合條件的預約資料</div>;
  }

  return (
    <div className="reservation-table-container">
      <h2>預約列表</h2>
      <p>共找到 {reservations.length} 筆預約紀錄</p>
      <table className="reservation-table">
        <thead>
          <tr>
            <th>預約編號</th>
            <th>學號</th>
            <th>座位編號</th>
            <th>時段編號</th>
            <th>預約時間</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.student_id}</td>
              <td>{reservation.seat_id}</td>
              <td>{reservation.timeslot_id}</td>
              <td>{formatDateTime(reservation.create_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;