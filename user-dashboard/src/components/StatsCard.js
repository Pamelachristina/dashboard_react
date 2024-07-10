import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value }) => {
    return (
        <div className="stats-card">
            <div className="stats-card-title">{title}</div>
            <div className="stats-card-value">{value}</div>
        </div>
    );
};

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default StatsCard;

