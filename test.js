// async function pasteImage() {
//     try {
//         const items = await navigator.clipboard.read();
//         for (const item of items) {
//             if (item.types.includes("image/png")) {
//                 const blob = await item.getType("image/png");
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     const base64 = reader.result; // "data:image/png;base64,...."
//                     // (Tùy chọn) Gửi lên server
//                     fetch("http://localhost:3994/post", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                             contents: "Bạn đang làm câu hỏi trắc nghiệm từ ảnh, hãy chọn đáp án đúng và trả lời ngắn gọn:",
//                             image: base64,
//                         }),
//                     })
//                         .then((res) => res.json())
//                         .then(data => {
//                             console.log(data);
//                             alert(data.data)

//                         });
//                 };
//                 reader.readAsDataURL(blob);
//             }
//         }
//     } catch (err) {
//         console.error("Clipboard error:", err);
//     }
// }

// document.addEventListener('keydown', (e) => {
//     if (e.key.toLowerCase() === 'p' || e.key.toLocaleLowerCase() === 'y') {
//         console.log(e.key);
//         pasteImage();
//     }
// });


// fetch("http://localhost:3994/post", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//         contents: "",
//         type: 0,
//     }),
// })
//     .then((res) => res.json())
//     .then(data => {
//         console.log(data);
//     });


// fetch('http://localhost:3994').then(res => res.json()).then(data => console.log(data.promptImage))