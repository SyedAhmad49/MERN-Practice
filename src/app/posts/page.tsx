'use client';
import { title } from "process";
import { useEffect, useState } from "react";
interface PostProps {
  _id: string;
  title: string;
  content: string;
}

interface ApiResponse {
  message: string;
  posts: PostProps[];
}
export default function Posts() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [post, setPost] = useState({ title: '', content: '' });
  const fetchPosts = () => {
    fetch('http://localhost:3001/api/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        setPosts(data?.posts)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const addPost = (newPost: Omit<PostProps, '_id'>) => {
    fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data: { message: string, postId: "string" }) => {
        // Add the new post to the current state
        setPosts((prevPosts) => [...prevPosts, { ...newPost, _id: data.postId }]);
      })
      .catch((error) => {
        console.error('There was a problem with the post operation:', error);
      });
  };
  useEffect(() => {
    fetchPosts()
  }, [])

  const deletePost = (id: string) => {
    fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      })
      .catch((error) => {
        console.error('There was a problem with the delete operation:', error);
      });
  };
  return (
    <main>
      <div style={{
        marginTop:"20px",
        marginBottom: "10px",
        textAlign:"center",
        fontSize:"20px",
        fontWeight:"bold"
      }}
      >Available Posts are</div>
      <div style={{
        marginTop:"20px",
        marginBottom: "10px",
        display: "flex",
        flexWrap: "wrap", // Allows wrapping if items exceed the container's width
        alignItems: "center",
        width: "100%"
      }}>
        {posts?.map((data: PostProps, index) => {
          return (
            <div key={index} style={{
              // flex: "1 1 30%", // Ensures the child takes up roughly 33% of the width and can shrink if necessary
              boxSizing: "border-box", // Ensures padding and border are included in the width
              // margin: "10px", // Adds margin between the items
              marginRight: "10px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "white",
              padding: "20px",
              maxWidth: "calc(30%)",
              minWidth: "calc(30%)"
            }}>
              <div style={{ color: "black" }}>{data?.title}</div>
              <div style={{ color: "black" }}>{data?.content}</div>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                <button style={{ minWidth: "100px", padding: "5px", cursor: "pointer" }}>Edit</button>
                <button style={{ minWidth: "100px", padding: "5px", cursor: "pointer" }} onClick={() => deletePost(data?._id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
      {posts && posts.length > 0 && <div>
        <div style={{ marginBottom: "10px" }}><input style={{ padding: "10px", minWidth: "calc(30%)" }} placeholder="Title" value={post?.title} onChange={(e) => setPost({ ...post, title: e.target.value })} /></div>
        <div style={{ marginBottom: "10px" }}><input style={{ padding: "10px", minWidth: "calc(30%)" }} placeholder="Content" value={post?.content} onChange={(e) => setPost({ ...post, content: e.target.value })} /></div>
        <div style={{ textAlign: "right", maxWidth: "calc(30%)" }}><button style={{ minWidth: "100px", padding: "5px" }} onClick={() => addPost(post)}>Add Post</button></div>
      </div>
      }
    </main>
  );
}
