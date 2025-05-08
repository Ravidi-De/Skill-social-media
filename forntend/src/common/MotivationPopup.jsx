// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const MotivationPopup = () => {
//   const [posts, setPosts] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   // Helper to check if a post is older than 1 day
//   const isOlderThanOneDay = (postDateStr) => {
//     const postDate = new Date(postDateStr);
//     const now = new Date();
//     return (now - postDate) > 24 * 60 * 60 * 1000;
//   };

//   // Fetch posts
//   const fetchPosts = async () => {
//     try {
//       const res = await axios.get('http://localhost:8080/api/v1/feed'); // your posts endpoint
//       setPosts(res.data);
//     } catch (error) {
//       console.error('Failed to fetch posts:', error);
//     }
//   };

//   console.log(posts,"Postssssssssssssssssss")
//   // Fetch motivation messages
//   const fetchMessages = async (eligiblePosts) => {

//     try {
//       const fetched = await Promise.all(
//         eligiblePosts.map(async (post) => {
//           const res = await axios.get('http://localhost:8080/api/v1/user/motivation'); 
//           console.log(res.data.motivationMessage,"iiiiiiiiiiiiiiiiiiiiiiiiiiiiii")// your motivation endpoint
//           return {
//             postId: post.id,
//             description: post.description,
//             motivationMessage: res.data.motivationMessage,
//           };
//         })
//       );
//       setMessages(fetched);
//       setShowModal(true);

      
//     } catch (error) {
//       console.error('Failed to fetch motivational messages:', error);
//     }
//   };

//   console.log(messages,"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")

//   // Initial and interval setup
//   useEffect(() => {
//     const checkAndShow = async () => {
//       await fetchPosts();
//     };

//     checkAndShow(); // initial

//     const interval = setInterval(async () => {
//       const res = await axios.get('http://localhost:8080/api/v1/feed');
//       const eligible = res.data.filter((post) => isOlderThanOneDay(post.postDate));

//       // console.log(eligible,"dateeeeeeeeeeeeeeeeeeeeeee")
//       if (eligible.length > 0) {
//         await fetchMessages(eligible);
//       }
//     }, 30000); // every 3 minutes

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h3>🌟 Motivational Boost!</h3>
//             <ul>
//               {messages.map((msg) => (
//                 <li key={msg.postId} style={styles.messageBox}>
//                   {/* <p><strong>{msg.description}</strong></p> */}
//                   <p>{msg.motivationMessage}</p>
//                 </li>
//               ))}
//             </ul>
//             <button onClick={() => setShowModal(false)} style={styles.button}>Close</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const styles = {
//   overlay: {
//     position: 'fixed',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   modal: {
//     background: '#fff',
//     borderRadius: '10px',
//     padding: '2rem',
//     width: '500px',
//     maxHeight: '80vh',
//     overflowY: 'auto',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
//     animation: 'fadeIn 0.3s',
//   },
//   messageBox: {
//     background: '#f0f8ff',
//     marginBottom: '1rem',
//     padding: '1rem',
//     borderRadius: '6px',
//   },
//   button: {
//     marginTop: '1rem',
//     padding: '0.6rem 1.2rem',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//   }
// };

// export default MotivationPopup;
