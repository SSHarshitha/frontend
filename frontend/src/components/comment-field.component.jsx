import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
    const { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);
    const { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext);
    const [comment, setComment] = useState("");

    const handleComment = () => {
        // Check if user is logged in
        if (!access_token) {
            return toast.error("Login first to leave a comment.");
        }

        // Validate if comment is not empty
        if (!comment.length) {
            return toast.error("Write something to leave a comment...");
        }

        // Make the request to add a comment or reply
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            _id, 
            blog_author, 
            comment, 
            replying_to: replyingTo
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {
            // Clear the comment input field
            setComment("");

            // Add user information to the new comment data
            data.commented_by = { personal_info: { username, profile_img, fullname } };

            let newCommentArr;

            if (replyingTo) {
                // Handling reply case
                commentsArr[index].children.push(data._id); // Add new reply ID to parent comment's children

                // Increment childrenLevel for reply
                data.childrenLevel = commentsArr[index].childrenLevel + 1;
                data.parentIndex = index;

                // Mark replies as loaded for the parent comment
                commentsArr[index].isReplyLoaded = true;

                // Insert the new reply directly after the parent comment
                commentsArr.splice(index + 1, 0, data);

                newCommentArr = commentsArr;
                setReplying(false); // Close the reply form

            } else {
                // Handling top-level comment case
                data.childrenLevel = 0; // Top-level comment
                newCommentArr = [data, ...commentsArr]; // Add the new comment to the beginning of the array
            }

            // Update total parent comments count if it's a top-level comment
            const parentCommentIncrement = replyingTo ? 0 : 1;

            // Update blog state with new comments and activity
            setBlog({ 
                ...blog, 
                comments: { ...comments, results: newCommentArr }, 
                activity: { 
                    ...activity, 
                    total_comments: total_comments + 1, 
                    total_parent_comments: total_parent_comments + parentCommentIncrement 
                }
            });

            // Increment total parent comments loaded count for UI purposes
            setTotalParentCommentsLoaded(prev => prev + parentCommentIncrement);

        })
        .catch(err => {
            console.log(err);
            toast.error("Something went wrong. Please try again.");
        });
    };

    return (
        <>
            <Toaster />
            <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..." 
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto">
            </textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleComment}>{action}</button>    
        </>
    );
};

export default CommentField;
