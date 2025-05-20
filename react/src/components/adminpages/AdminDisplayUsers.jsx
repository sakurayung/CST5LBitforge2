    import { Link } from "react-router-dom";
    import placeholderImg from './../../assets/placeholder-profile_3_5.png';
    import adminimg from './../../assets/Untitled.png';
    import usersDashboard from './adminUsersDashboard.module.scss';

    export default function AdminUsersDashboard({
      arr,
      onDelete = () => {},
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
                  <div key={index} className={usersDashboard.userwrap}>
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
