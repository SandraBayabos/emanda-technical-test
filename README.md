## Short description of what I implemented

### Backend
`tasks.entity.ts` - Created a new Column to the Task entity that stores a parentId, to link a subtask specifically to its parent

`tasks.service.ts` 

- Modified the `findAll()` API to retrieve tasks where `{parent: IsNull()}` to only retrieve the outermost parent tasks i.e. only the top-level tasks. This is to ensure that subtasks are not also fetched and displayed independently of their parent
- Created the `findSubtasks` method to retrieve child subtasks for a specific parent, supporting on-demand loading instead of fetching the entire task hierarchy at one go.

`tasks.controller.ts` - Added a dedicated `GET /:id/subtasks` endpoint to fetch subtasks by parent ID

### Frontend
`api.ts` - Added a new frontend API function called `fetchSubtasks` that accepts a parent taskID and returns an array of subtasks

`TaskContext.tsx`

- Redesigned Task Context to implement on-demand loading of task levels, with a dedicated `loadSubtasks` method for fetching and loading subtasks of a parent
- Optimised state management by appending new tasks and subtasks directly into the state instead of re-fetching all the tasks after new tasks are added

`TaskList.tsx` - Added a `useEffect` to call `refreshTasks()` to fetch the top-level parent tasks when the component mounts

`TaskItem.tsx` - Rebuilt the TaskItem component to implement lazy-loading and recursive rendering of task and subtask levels. I added expand-and-collapse functionality on each task box, to fetch subtasks upon expanding, and also the Add Subtask button to create new subtasks.

## AI Tools Used:
### Cline + Gemini 2.5 (VSCode extention)
__AI Result:__
- `TaskContext.tsx`: The `addTask` function works but is inefficient because it refetches *all* tasks from the backend after adding a new one. It should update the local state directly with the newly created task returned by the API.
- Other recommendation:
    - use `try catch` blocks around API calls for better error handling


### - Claude Code (terminal plugin)
__AI Result:__
- Duplicate display of subtask - beneath the parent task & also independently in the task list (due to how `findAll()` works)
    -> MY SOLUTION: update backend query to only return top-level tasks, i.e. tasks where parent is null
- Claude AI's solution still involved backend query returing ALL subtasks in the `tasks` query, which was problematic in my opinion:
    - It did not fetch the subtasks on demand
    - Posed performance issues due to recursive nature (what if there were too many nested levels of subtasks)
    - Meant more logic on the frontend to handle the filtering
    -> MY SOLUTION: Stick to my initial plan and retrieve subtasks based on frontend interaction i.e. make an API call when clicking on a parent task's dropdown
        - Create a new parentId column for Task to link each subtask to its parent
- Conclusion: I did not fully use Claude AI's solution

## Roadmap/List of ideas of how I would improve it with more time

- Improve the error handling on both the backend and frontend to ensure clarity for the user and so that it would be easier to debug
- Introduce concept of `user_id` into each task so that we can have task-assignment
- Either infinite scroll or pagination if the specific use-case anticipates a large quantity of tasks
- Additional features that I would add:
    - Search/Filter to allow users to search for specific tasks/subtasks
    - Checkboxes to allow users to mark tasks as DONE
        - I would also add in timestamps so users can see when each task was created
    - Allow users to DELETE tasks
    - Adjust the entire UI to allow users to click + drag and reorder tasks


## What I would have asked prior to starting this
- The instructions were quite specific with the necessary "challenge" hidden within the provided code, so I would not have asked for any clarification around the task itself
- But I perhaps would have asked whether there were any other expectations surrounding the challenge, as what specific aspects the developer wanted to see from me, such as some focus on styling or to consider additional features to implement. 
- As these were not mentioned, I did end up contemplating for a while on how much wider I could've tackled this challenge and what other features I should implement, before I chose to focus on the task at hand

## What I would have asked post-challenge in regards to architecture & design of the app
- What type of "task" tracker is this for e.g. something like Jira, Clickup, Monday
- Useful to know the scope, the audience and how we want to scale so that features can be adjusted based on the intended use-case

## Task manager demo video:

[![Task Manager Demo](https://img.youtube.com/vi/fWEdI7FzY9g/0.jpg)](https://www.youtube.com/watch?v=fWEdI7FzY9g)

