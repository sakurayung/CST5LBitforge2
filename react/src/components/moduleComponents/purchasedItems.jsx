import { Link } from 'react-router-dom';

import { useGlobalContext } from '../context/globalContextProvider';

import purch from './purchasedItems.module.scss';

export default function PurchasedItems () {
  const { user } = useGlobalContext();

  console.log (user.purchase_receipts);

  return (
    <div className={purch.purchaseswrap}>
      {user.purchase_receipts.length > 0 ? (
        user.purchase_receipts.map((receipt, index)=>(
          <Link key={index} to={`../item/${receipt.item_id}`}
          style={{ textDecoration: 'none'}}>
            <div className={purch.purchaseDiv}>
              <div className={purch.updiv}>
                <div className={purch.leftdiv}>
                  <img src={`${import.meta.env.VITE_API_BASE_URL}${receipt.image_url}`} alt={receipt.item_name} />
                </div>
                <div className={purch.rightdiv}>
                  <div className={purch.up}>
                    <div>
                      <p><i>Ordered at: {receipt.ordered_at}</i></p>
                    </div>
                    <div>
                      <p><i>Delivered at: {receipt.delivered_at}</i></p>
                    </div>
                  </div>
                  <div className={purch.middle}>
                    <div>
                      <p>Receipt ID: {receipt.id}</p>
                    </div>
                    <div>
                      <p>Item: {receipt.item_name} <i> <b>{receipt.item_id}</b></i></p>
                    </div>
                    <div>
                      <p>Unit Price: PHP {receipt.unit_price}</p>
                    </div>
                    <div>
                      <p>Quantity: {receipt.quantity}</p>
                    </div>
                    <div>
                      <p>Total: PHP {receipt.total_price}</p>
                    </div>
                  </div>
                  <div className={purch.down}>
                    <div>
                      <p>Shipped from at: {receipt.shipped_from}</p>
                    </div>
                    <div>
                      <p>Delivered to: {receipt.deliver_to}</p>
                    </div>
                    <div>
                      <p>Shipping Fee: PHP {receipt.shipping_fee}</p>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className={purch.downdiv}>
                <p><b>GRAND TOTAL : PHP {receipt.grand_total}</b></p>
              </div>
            </div>
          </Link>
        ))
      ):( <div className={purch.error}>no purchased items</div>)}
    </div>
  )
}