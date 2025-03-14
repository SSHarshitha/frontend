import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect,useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";
// import UserAuthForm from "../pages/userAuthForm.page";

const BlogEditor = () => {
  let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
  let { userAuth: { access_token } } = useContext(UserContext);
  let { blog_id } = useParams();
  let navigate = useNavigate();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => { 
    if (!textEditor.isReady) {
      const editor = new EditorJS({
        holder: "text-Editor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story",
        onChange: async () => {
          const data = await editor.save();
          const words = countWordsInEditor(data);
          setWordCount(words);}
      });
      setTextEditor(editor)
    }
  }, []);

  const handleBannerUpload = async (e) => {
    let img = e.target.files[0];
    console.log('Selected image:', img);

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      try {
        const url = await uploadImage(img);
        console.log("Uploaded image URL:", url); // Log the URL to the console
        toast.dismiss(loadingToast);
        toast.success("Uploaded");
        setBlog({ ...blog, banner: url });
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(err.message);
      }
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  }

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  }

  const countWordsInEditor = (data) => {
    const text = data.blocks.map(block => block.data.text).join(" ");
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const setReadingTime=(count)=>{
    let readTime=0;
    if(count>500){
      return readTime=10;
    }
    if(count>300){
      return readTime=7;
    }
    if(count>180){
      return readTime=5;
    }
    if(count>0){
      return readTime=3;
    }
  }

  const handleSaveDraft = async (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Write blog title before saving to draft.");
    }

    let loadingToast = toast.loading("Saving Draft...");
    e.target.classList.add('disable');



      if (textEditor.isReady) {

        textEditor.save().then(content=>{
          const desString = des.length ? des : "";
          const readingTime=setReadingTime(wordCount);
          // const author = userAuth?.user || { personal_info: { username: "Unknown Author" } };
          let blogObj = { 
            title, banner, des: desString, content, tags,wordCount,readingTime, draft: true };

          // console.log("Blog Object:", blogObj); //debug



          axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/create-blog", { ...blogObj, id: blog_id }, {
            headers: { 'Authorization': `Bearer ${access_token} `}
          }).then(()=>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Draft Saved");
          setTimeout(() => { navigate("/") }, 500);
          }).catch(({response})=>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response.data.error || "An error occurred");
          })     
    })
  }
  }

  const handlePublishEvent = async () => {
    if (!banner.length) {
      return toast.error("Upload a Blog Banner to publish it");
    }
    if (!title.length) {
      return toast.error("Write Blog title to publish it");
    }

    try {
      if (textEditor.isReady) {
        const data = await textEditor.save();
        if (data.blocks.length) {
          const words=countWordsInEditor(data);
          const readingTime=setReadingTime(words);
          
          setBlog({ ...blog, content: data,wordCount:words,readingTime });
          setEditorState("publish");

          const desString = des.length ? des : "";
          let blogObj = { 
            title, banner, des: desString, content, tags,wordCount:words,readingTime
          }
          // console.log("Blog Object:", blogObj); //debug
        } else {
          toast.error("Write something in your blog to publish it");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving the blog content");
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="max-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-29 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />

            <div id="text-Editor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default BlogEditor;