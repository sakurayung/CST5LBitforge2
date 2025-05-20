import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { useGlobalContext } from '../context/globalContextProvider';
import placeholderImg from './../../assets/placeholder-profile_3_5.png';
import adminimg from './../../assets/Untitled.png';
import comment from './displayComments.module.scss';

export default function DisplayComments() {

  const { user, item } = useGlobalContext();

  console.log(item.comments);

  return (
    <div className={comment.commentwrap}>
      {item.comments?.map((cmnt, index)=>(
        <div key={index}>
          <div className={comment.username}>
            <img src={cmnt.role?.toLowerCase() === 'admin' ? adminimg : cmnt.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}${cmnt.profile_picture}`
              : placeholderImg} alt="" />
            <h4>{cmnt.username}</h4>
            {cmnt.role?.toLowerCase() === "admin" && (
              <div className={comment.userrole}>
                <p>{cmnt.role?.charAt(0).toUpperCase() + cmnt.role?.slice(1).toLowerCase()}</p>
              </div>
            )}
          </div>
          <div className={comment.comment}>
              <div>
                <p>{cmnt.comment}</p>
              </div>
          </div>
        </div>
      ))}
    </div>
  )
}