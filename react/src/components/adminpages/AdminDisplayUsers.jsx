    import { Link } from "react-router-dom";
    import placeholderImg from './../../assets/placeholder-profile_3_5.png';
    import adminimg from './../../assets/Untitled.png';
    import usersDashboard from './adminUsersDashboard.module.scss';

    export default function AdminUsersDashboard({
      arr,
      onDelete = () => {},
      onSuspend = () => {},
      onSortChange = () => {},
      onSearchChange = () => {},
    }) {
      console.log(arr);

      const handleSearchInput = (e) => {
        onSearchChange(e.target.value);
      };

      return (
        <div className={usersDashboard.populatewrap}>
          <div className={usersDashboard.populateItems}>
            <div className={usersDashboard.header}>
              <div className={usersDashboard.search}>
                <input
                  type="text"
                  placeholder="Search users..."
                  onChange={handleSearchInput}
                />
              </div>
              <select
                name="typesearch"
                className={usersDashboard.typesearch}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="id">Id</option>
                <option value="username">Username</option>
              </select>
            </div>

            <div className={usersDashboard.body}>
              <div className={usersDashboard.populateUserswrap}>
                {arr.map((user, index) => (
                  <div key={index} className={!user.is_suspend ? usersDashboard.userwrap1 : usersDashboard.userwrap2}>
                    <div className={usersDashboard.idwrap}>
                      <p># {user.user_id}</p>
                    </div>

                    <div className={usersDashboard.imgwrap}>
                      <img
                        src={user.role?.toLowerCase() === 'admin' ? adminimg : user.profile_picture ? 
                          `${import.meta.env.VITE_API_BASE_URL}${user.profile_picture}`
                          : placeholderImg}
                        alt="user"
                      />
                    </div>

                    <div className={usersDashboard.namewrap}>
                      <div className={usersDashboard.username}>
                        <h4>{user.username}</h4>
                        {user.role === 'admin' && (
                          <div className={usersDashboard.rolewrap}>{user.role}</div>
                        )}
                      </div>
                      <div className={usersDashboard.emailwrap}>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    {user.role === 'user' && (
                      <div className={usersDashboard.deletewrap}>
                        {!user.is_suspend ? (
                          <button className={usersDashboard.suspendbtn} onClick={(e) => onSuspend(e, user.user_id, user.is_suspend)}>
                            <p>Suspend</p>
                          </button>
                        ):(
                          <button className={usersDashboard.unsuspendbtn} onClick={(e) => onSuspend(e, user.user_id, user.is_suspend)}>
                            <p>Unsuspend</p>
                          </button>
                        )}
                        <button className={usersDashboard.deletebtn} onClick={(e) => onDelete(e, user.user_id)}>
                          <p>Delete</p>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
