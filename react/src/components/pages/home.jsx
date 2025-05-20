import { Link } from 'react-router-dom';

import PopulateItems from '../moduleComponents/populateItems';
import { useGlobalContext } from '../context/globalContextProvider';

import home from'./home.module.scss';

export default function Home() {
  const { 
    setAmount,
    displayTopPreBuildDesktop,
    displayTopgamingLaptop,
    displayTopgamingDesktop,
    displayTopgamingAccessories,
  } = useGlobalContext();

  setAmount(0);

  return (
    <div className={home.home}>
      {/* display top items*/}
      <div>
        <section>
          <div>
            <h3>Top Pre-build Dektops</h3>
          </div>
          <div className={home.displayitemwrapper}>
          {displayTopPreBuildDesktop? (
            <>
            {displayTopPreBuildDesktop?.map((item) => (
              <Link to={`item/${item.item_id}`} key={item.item_id}
              style={{ textDecoration: 'none'}}  
              >
                <PopulateItems item={item} />
              </Link>
            ))}
            </>
          ):(
            <p>No Items fetched</p>
          )}
          </div>
        </section>

        <section>
          <div>
            <h3>Top Gaming Laptops</h3>
          </div>
          <div className={home.displayitemwrapper}>
          {displayTopgamingLaptop? (
            <>
            {displayTopgamingLaptop?.map((item) => (
              <Link to={`item/${item.item_id}`} key={item.item_id}
              style={{ textDecoration: 'none'}}  
              >
                <PopulateItems item={item} />
              </Link>
            ))}
            </>
          ):(
            <p>No Items fetched</p>
          )}
          </div>
          
        </section>

        <section>
          <div>
            <h3>Top Gaming Desktops</h3>
          </div>
          <div className={home.displayitemwrapper}>
          {displayTopgamingDesktop? (
            <>
            {displayTopgamingDesktop?.map((item) => (
              <Link to={`item/${item.item_id}`} key={item.item_id}
              style={{ textDecoration: 'none'}}  
              >
                <PopulateItems item={item} />
              </Link>
            ))}
            </>
          ):(
            <p>No Items fetched</p>
          )}
          </div>
        </section>

        <section>
          <div>
            <h3>Top Gaming Accessories</h3>
          </div>
          <div className={home.displayitemwrapper}>
          {displayTopgamingAccessories? (
            <>
            {displayTopgamingAccessories?.map((item) => (
              <Link to={`item/${item.item_id}`} key={item.item_id}
              style={{ textDecoration: 'none'}}  
              >
                <PopulateItems item={item} />
              </Link>
            ))}
            </>
          ):(
            <p>No Items fetched</p>
          )}
          </div>
        </section>

      </div>
    </div>
  )
}