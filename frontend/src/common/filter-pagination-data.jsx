import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user = undefined,
}) => {
  // Initialize headers with optional Authorization if user token is provided
  const headers = user ? { headers: { Authorization: `Bearer ${user}` } } : {};

  // Initialize state if it's not already an object
  if (!state || typeof state !== "object") {
    state = { results: [], totalDocs: 0, page: 1 };
  }

  // Ensure state.results is an array
  if (!Array.isArray(state.results)) {
    state.results = [];
  }

  let obj;

  // Decide whether to append to current results or fetch a new set
  if (state !== null && !create_new_arr) {
    // Append new data to existing state results
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    // Fetch total document count and initialize new object
    const totalDocs = await getTotalDocs(countRoute, data_to_send, headers);
    obj = { results: data, page: 1, totalDocs };
  }

  return obj;
};

// Separate function to fetch total documents count
const getTotalDocs = async (countRoute, data_to_send, headers) => {
  try {
    const { data } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + countRoute,
      data_to_send,
      headers
    );
    return data.totalDocs;
  } catch (err) {
    console.log(err);
    return 0;
  }
};
