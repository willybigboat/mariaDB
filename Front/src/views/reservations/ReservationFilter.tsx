import { useState, FormEvent } from 'react';
import { ReservationQueryParams } from '../../interfaces/Reservation';
import '../../styles/ReservationFilter.css';

interface ReservationFilterProps {
  onFilterChange: (filters: ReservationQueryParams) => void;
}

export const ReservationFilter = ({ onFilterChange }: ReservationFilterProps) => {
  const [studentId, setStudentId] = useState<string>('');
  const [seatId, setSeatId] = useState<string>('');
  const [timeslotId, setTimeslotId] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // 準備過濾參數
    const filters: ReservationQueryParams = {};
    if (studentId) filters.studentId = studentId;
    if (seatId) filters.seatId = Number(seatId);
    if (timeslotId) filters.timeslotId = Number(timeslotId);
    
    onFilterChange(filters);
  };

  const handleReset = () => {
    setStudentId('');
    setSeatId('');
    setTimeslotId('');
    onFilterChange({});
  };

  return (
    <div className="filter-container">
      <h3>預約查詢條件</h3>
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="student-id">學號</label>
            <input 
              id="student-id"
              type="text" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="輸入學生學號"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="seat-id">座位編號</label>
            <input 
              id="seat-id"
              type="number" 
              value={seatId} 
              onChange={(e) => setSeatId(e.target.value)}
              placeholder="輸入座位編號"
              min="1"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="timeslot-id">時段編號</label>
            <input 
              id="timeslot-id"
              type="number" 
              value={timeslotId} 
              onChange={(e) => setTimeslotId(e.target.value)}
              placeholder="輸入時段編號"
              min="1"
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button type="submit" className="btn-submit">查詢</button>
          <button type="button" className="btn-reset" onClick={handleReset}>重置</button>
        </div>
      </form>
    </div>
  );
};

export default ReservationFilter;