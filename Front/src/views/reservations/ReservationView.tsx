import { useState } from 'react';
import ReservationFilter from './ReservationFilter';
import ReservationTable from './ReservationTable';
import { ReservationQueryParams } from '../../interfaces/Reservation';

const ReservationView = () => {
  const [filters, setFilters] = useState<ReservationQueryParams>({});

  const handleFilterChange = (newFilters: ReservationQueryParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="reservation-view">
      <ReservationFilter onFilterChange={handleFilterChange} />
      <ReservationTable filters={filters} />
    </div>
  );
};

export default ReservationView;