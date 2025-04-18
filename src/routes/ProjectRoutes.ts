import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import {
  validateNoteId,
  validateProjectId,
  validateTaskId,
  validateUserId,
  validateUserIdParam,
} from "../middleware/validateId";
import { validateProjectInput } from "../middleware/validateProjectInput";
import { TaskController } from "../controllers/TaskController";
import { projectBelongsToUser, projectExists } from "../middleware/project";
import { validateTaskInput } from "../middleware/validateTaskInput";
import { validateTaskStatus } from "../middleware/validateTaskStatus";
import {
  hasAutorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { validateEmailInput } from "../middleware/validateEmailInput";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";
import { validateNoteInput } from "../middleware/validateNoteInput";

const router = Router();

router.use(authenticate);

router.param("projectId", validateProjectId);
router.param("projectId", projectExists);
router.param("projectId", projectBelongsToUser);

router.param("taskId", validateTaskId);
router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

/**Routes for project **/
router.post(
  "/",
  validateProjectInput,
  handleInputErrors,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);
router.get("/:projectId", ProjectController.getProjectById);
router.put(
  "/:projectId",
  validateProjectInput,
  handleInputErrors,
  ProjectController.updateProject
);
router.delete("/:projectId", ProjectController.deleteProject);

/**Routes for task **/
router.post(
  "/:projectId/tasks",
  hasAutorization,
  validateTaskInput,
  handleInputErrors,
  TaskController.createTask
);
router.get("/:projectId/tasks", TaskController.getProjectTasks);
router.get("/:projectId/tasks/:taskId", TaskController.getTaskById);
router.put(
  "/:projectId/tasks/:taskId",
  hasAutorization,
  validateTaskInput,
  handleInputErrors,
  TaskController.updateTask
);
router.delete(
  "/:projectId/tasks/:taskId",
  hasAutorization,
  TaskController.deleteTask
);
router.post(
  "/:projectId/tasks/:taskId/status",
  validateTaskStatus,
  handleInputErrors,
  TaskController.updateTaskStatus
);

/** Routes for teams **/
router.post(
  "/:projectId/team/find",
  validateEmailInput,
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.get("/:projectId/team", TeamController.getProjectTeam);
router.post("/:projectId/team", validateUserId, TeamController.addMemberById);
router.delete(
  "/:projectId/team/:userId",
  validateUserIdParam,
  TeamController.removeMemberById
);

/** Routes for Notes */
router.post(
  "/:projectId/tasks/:taskId/notes",
  validateNoteInput,
  handleInputErrors,
  NoteController.createNote
);

router.get("/:projectId/tasks/:taskId/notes", NoteController.getTaskNote);
router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  validateNoteId,
  NoteController.deleteNote
);

export default router;
