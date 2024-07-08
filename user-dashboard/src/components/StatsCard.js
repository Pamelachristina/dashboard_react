import React from 'react';

const StatsCard = ({ title, value }) => {
    return (
        <div className="bg-white shadow-sm text-dark">
            <h3 className="text-muted mb-2">{title}</h3>
            <p className="display-3 font-weight-bold">{value}</p>
        </div>
    );
}

export default StatsCard;
