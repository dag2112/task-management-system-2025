package org.wldu.webservices.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.dtoFiles.CommentRequest;
import org.wldu.webservices.dtoFiles.CommentResponse;
import org.wldu.webservices.services.contracts.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public void addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentRequest request,

            Authentication auth
    ) {
        String username = auth.getName();
        commentService.addComment(taskId, request.getContent(), username);
    }

    @GetMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")

    public List<CommentResponse> getComments(@PathVariable Long taskId) {
        return commentService.getComments(taskId);
    }
}
