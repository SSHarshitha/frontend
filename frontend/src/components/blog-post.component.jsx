import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content, author }) => {
  const {
    publishedAt,
    tags,
    title,
    des,
    banner,
    readingTime,
    activity: { total_likes },
    blog_id: id,
  } = content;
  const { fullname, profile_img, username } = author;

  // Function to calculate reading time based on word count
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 10; // average reading speed
    const words = text ? text.split(" ").length : 0;
    return Math.ceil(words / wordsPerMinute);
  };

  const setTime = (t) => {
    if (t === undefined) {
      return calculateReadingTime(des);
    }
    return t;
  };

  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hiiden line-clamp-2">
          {" "}
          {des}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4"> {tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
          <span className="ml-3 flex items-center gap-2 text-dark-black">
            <i className="fi fi-rr-time-quarter-to"></i>
            {setTime(readingTime)} mins read
          </span>
        </div>
      </div>

      <div className="h-20 aspect-square bg-grey">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
