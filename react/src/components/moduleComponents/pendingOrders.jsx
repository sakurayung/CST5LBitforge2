import { Link } from 'react-router-dom';

import { useGlobalContext } from '../context/globalContextProvider';

import pOrder from './pendingOrders.module.scss';

export default function PendingOrders() {

  const { user } = useGlobalContext();

  return (
    <div className={pOrder.pOrderItems}>
      {user.pending_orders ? (
        user.pending_orders.map((pending, index) => (
          <div key={index}>
            <div>
              <div className={pOrder.up}>
                <Link to={`../item/${pending.item_id}`}
                style={{ textDecoration: 'none'}}  
                > 
                  <img src={`${import.meta.env.VITE_API_BASE_URL}${pending.image_url}`} alt={pending.item_name} />
                </Link>
                <h4>{pending.item_name}</h4>
              </div>
              <div className={pOrder.down}>
                <div className={pOrder.left}>
                  <div>Quantity: {pending.quantity}</div>
                  <div>unit price: PHP {pending.unit_price}</div>
                </div>
                <div className={pOrder.right}>
                  <div><p>Grand Total: PHP {pending.grand_total}</p></div>
                </div>
              </div>
            </div>
          </div>
        ))
      ):( <div>No pending orders</div>)}
    </div>
  )
}