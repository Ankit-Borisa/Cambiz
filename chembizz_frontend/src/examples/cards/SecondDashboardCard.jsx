import React from 'react'
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SecondDashboardCard = () => {
  return (
    <div>
        <div className='border rounded-xl pt-3 pb-4 ps-5 shadow-sm shadow-custom'>
          <div className='flex justify-between mb-5'>
            <div>
              <p className='text-xs opacity-[0.6] font-semibold'>Active User</p>
              <h4 className='font-medium opacity-[0.7] text-sm mt-3'><span className='text-xl font-bold opacity-1'>27</span>/80</h4>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SecondDashboardCard
