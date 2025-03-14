import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InpageNavigation from "../components/inpage-navigation.component";
import Blog from "../components/blog-post.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const Homepage = () => {
  const [blogs, setBlogs] = useState({ results: [], totalDocs: 0, page: 1 });
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [pageState, setPageState] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["programming", "hollywood", "film making", "social media", "cooking", "tech", "finance", "travel"];

  const fetchTrendingBlogs = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs");
      setTrendingBlogs(data.blogs);
    } catch (err) {
      console.log({ error: err.message });
    }
  };

  const fetchLatestBlogs = async ({ page = 1 }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page });
      const formattedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/all-latest-blogs-count",
      });
      setBlogs({ ...formattedData, results: data.blogs });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogsByCategory = async ({ page = 1 }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page });
      const formattedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/search-blogs-count",
        data_to_send: { tag: pageState },
      });
      setBlogs({ ...formattedData, results: data.blogs });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();
    setBlogs({ results: [], totalDocs: 0, page: 1 });
    setPageState(pageState === category ? "home" : category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
    if (!trendingBlogs.length) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InpageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
            <>
              {isLoading && <Loader />}
              {!isLoading && blogs.results.length === 0 && <NoDataMessage message="No blogs published" />}
              {!isLoading && blogs.results.length > 0 && (
                blogs.results.map((blog, i) => (
                  <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                    <Blog content={blog} author={blog.author.personal_info} />
                  </AnimationWrapper>
                ))
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory}
              />
            </>
            <>
              {isLoading && <Loader />}
              {!isLoading && trendingBlogs.length === 0 && <NoDataMessage message="No trending blog" />}
              {!isLoading && trendingBlogs.length > 0 && (
                trendingBlogs.map((blog, i) => (
                  <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                ))
              )}
            </>
          </InpageNavigation>
        </div>
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => (
                  <button
                    onClick={loadBlogByCategory}
                    className={"tag " + (pageState === category ? "bg-black text-white " : "")}
                    key={i}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {isLoading ? (
                <Loader />
              ) : (
                trendingBlogs.length ? (
                  trendingBlogs.map((blog, i) => (
                    <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NoDataMessage message="No trending blog" />
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
