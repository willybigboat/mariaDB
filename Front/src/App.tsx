import { useEffect, useState } from 'react';
import './App.css';
import { getReservationsList, testConnection } from './utils/fetch';
import { Reservation } from './interfaces/Reservation';
import ReservationView from './views/reservations/ReservationView';

function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionTesting, setConnectionTesting] = useState<boolean>(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await getReservationsList();
        if (response.error) {
          setError(response.error);
          setReservations([]);
        } else {
          setReservations(response.data || []);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || '無法獲取預約列表');
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleTestConnection = async () => {
    setConnectionTesting(true);
    try {
      await testConnection();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.error("連接測試失敗:", error);
    } finally {
      setConnectionTesting(false);
    }
  };

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

  return (
    <div className="simple-app-container">
      <header className="simple-header">
        <h1>實驗室座位預約系統</h1>
        <div className="connection-test">
          <button 
            onClick={handleTestConnection}
            disabled={connectionTesting}
            className={connectionTesting ? 'btn-testing' : ''}
          >
            {connectionTesting ? '測試中...' : '測試連接'}
          </button>
          {isConnected !== null && (
            <span className={`connection-status ${isConnected ? 'success' : 'error'}`}>
              {isConnected ? '連接成功' : '連接失敗'}
            </span>
          )}
        </div>
      </header>

      <main className="simple-main">
        {loading ? (
          <div className="loading">載入中...</div>
        ) : error ? (
          <div className="error">錯誤: {error}</div>
        ) : (
          <div className="reservation-section">
            <h2>預約列表</h2>
            {reservations.length === 0 ? (
              <p className="no-data">沒有預約記錄</p>
            ) : (
              <>
                <p className="record-count">共有 {reservations.length} 筆預約記錄</p>
                <div className="table-container">
                  <table className="simple-table">
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
              </>
            )}
          </div>
        )}
      </main>

      <footer className="simple-footer">
        <p>© 2025 實驗室座位預約系統 | MariaDB Demo</p>
      </footer>
    </div>
  );
}

export default App;
