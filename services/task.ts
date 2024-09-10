import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/tasks",
  }),
  tagTypes: ["Task"], // Define the tag type
  endpoints: (builder) => ({
    getTasks: builder.query<any, void>({
      query: () => "/",
      providesTags: ["Task"], // Tags this query will provide
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: "/",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"], // Invalidate 'Task' tag when creating a task
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Task"], // Invalidate 'Task' tag when updating a task
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"], // Invalidate 'Task' tag when deleting a task
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
