import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../requestHandlers/get.request";
import BlogContainer from "../components/blogContainer.component";
import { BlogInterface } from "../types/post.interface";
import { ReqError } from "../types/requestError.interface";
import "./blog.css";
import RequestError from "../components/requestError.component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Blog: FC = () => {
    // the *brand spankin new version* uses syntax for use param like bellow and not useParams<{id: string}>(); (witch is nice :) )
    const { id } = useParams<'id'>();
    const [post, setPost] = useState<BlogInterface | ReqError>();

    async function getBlogData()
    {
        setPost(await getRequest(process.env.REACT_APP_BACKEND_ADDRESS + "blog/" + id));
    }

    // this gets called once, when the page gets loaded
    useEffect(() => {
        getBlogData();
    }, []);   

    return (
        <div className="card-container">
            {post && ('error' in post) && (
                <RequestError errorCode={post.statusCode} errorMessage={post.message} />
            )}
            {post && !('error' in post) && (
                <BlogContainer id={post.id} title={post.title} date={post.date} views={post.views} childComp={<ReactMarkdown children={post.content} remarkPlugins={[remarkGfm]}/>}/>
            )}
        </div>
    );
}

export default Blog;