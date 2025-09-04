import React from 'react'
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DashboardCard = () => {
  return (
    <div>
        <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom'>
          <div className='flex justify-between mb-5'>
            <div>
              <p className='text-sm opacity-[0.6] font-semibold'>Total User</p>
              <h4 className='font-semibold text-xl mt-3'>40,390</h4>
            </div>
            <img src="" alt="" />
          </div>
          <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'><FontAwesomeIcon icon={faArrowTrendUp} />&nbsp;&nbsp;8.5%</span> Up from yesterday</p>
        </div>
    </div>
  )
}

export default DashboardCard
