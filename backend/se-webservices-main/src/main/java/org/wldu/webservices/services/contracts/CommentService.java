package org.wldu.webservices.services.contracts;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.wldu.webservices.auths.User;
import org.wldu.webservices.auths.UserRepository;
import org.wldu.webservices.dtoFiles.CommentResponse;
import org.wldu.webservices.enities.Comment;
import org.wldu.webservices.enities.Task;
import org.wldu.webservices.repositories.CommentRepository;
import org.wldu.webservices.repositories.TaskRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public void addComment(Long taskId, String content, String username) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setTask(task);
        comment.setUser(user);
        comment.setContent(content);

        commentRepository.save(comment);
    }

    public List<CommentResponse> getComments(Long taskId) {

        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(c -> {
                    CommentResponse r = new CommentResponse();
                    r.setId(c.getId());
                    r.setContent(c.getContent());
                    r.setUsername(c.getUser().getUsername());
                    r.setCreatedAt(c.getCreatedAt());
                    return r;
                })
                .toList();
    }
}
