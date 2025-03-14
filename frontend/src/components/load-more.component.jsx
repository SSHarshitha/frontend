import React from "react";
// //original code
// const LoadMoreDataBtn =({state,fetchDataFun}) =>{

//     if(state != null && state.totalDocs > state.length){

   
//         return (
//             <button 
//             onClick={()=>fetchDataFun({ page :state.page+1 })}
//             className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">
//                 Load More
//             </button>
         
//         )
//     }
// }

// export default LoadMoreDataBtn ;

// // replace after > this symbol

 // chat gpt -1 
// import React from "react";

// const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
//   const handleClick = () => {
//     console.log("Load more button clicked");
//     fetchDataFun({ page: state.page + 1 });
//   };

//   return (
//     <button onClick={handleClick} className="load-more-btn">
//       Load More
//     </button>
//   );
// };

// export default LoadMoreDataBtn;

//chat gpt-2

// import React from "react";

// const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
//   const handleLoadMore = () => {
//     if (state.page < Math.ceil(state.totalDocs / 10)) {
//       fetchDataFun({ page: state.page + 1 });
//     }
//   };

//   return (
//     <button onClick={handleLoadMore} disabled={state.page >= Math.ceil(state.totalDocs / 10)}>
//       Load More
//     </button>
//   );
// };

// export default LoadMoreDataBtn;

  
// chat gpt -3

// const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
//     if (state && state.totalDocs > state.results.length) {
//       return (
//         <button
//           onClick={() => fetchDataFun({ page: state.page + 1 })}
//           className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
//         >
//           Load More
//         </button>
//       );
//     }
//     return null;
//   };
  
//   export default LoadMoreDataBtn;
  

// chat gpt-4


const LoadMoreDataBtn = ({ state, fetchDataFun, additionalParam }) => {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchDataFun({ ...additionalParam, page: state.page + 1, append: true })}
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
      >
        Load More
      </button>
    );
  }
  return null;
};

export default LoadMoreDataBtn;

