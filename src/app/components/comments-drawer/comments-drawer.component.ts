import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  GoabButtonGroup,
  GoabFormItem,
  GoabText,
  GoabTextArea,
} from '@abgov/angular-components';
import {
  GoabxButton,
  GoabxDrawer,
  GoabxModal,
  GoabxMenuAction,
  GoabxMenuButton,
} from '@abgov/angular-components';
import {
  GoabTextAreaOnChangeDetail,
  GoabMenuButtonOnActionDetail,
} from '@abgov/ui-components-common';
import { ViewportService } from '../../services/viewport.service';
import { parseDate } from '../../utils/date-utils';

export interface Comment {
  id: number;
  author: string;
  timestamp: string;
  text: string;
  isOwned: boolean;
}

@Component({
  selector: 'app-comments-drawer',
  imports: [
    GoabButtonGroup,
    GoabFormItem,
    GoabText,
    GoabTextArea,
    GoabxButton,
    GoabxDrawer,
    GoabxModal,
    GoabxMenuAction,
    GoabxMenuButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './comments-drawer.component.html',
  styleUrl: './comments-drawer.component.css',
})
export class CommentsDrawerComponent {
  @Input() isOpen = false;
  @Input() comments: Comment[] = [];
  @Input() caseStatus?: string;

  @Output() close = new EventEmitter<void>();
  @Output() editComment = new EventEmitter<{ id: number; text: string }>();
  @Output() deleteComment = new EventEmitter<number>();

  constructor(private viewport: ViewportService) {}

  commentText = '';
  editingCommentId: number | null = null;
  editingCommentText = '';
  deleteCommentId: number | null = null;
  showDeleteCommentModal = false;

  get isMobile(): boolean {
    return this.viewport.isMobile();
  }

  get isCompletedCase(): boolean {
    return (
      !!this.caseStatus &&
      ['Accepted', 'Cancelled', 'Denied'].includes(this.caseStatus)
    );
  }

  get drawerMaxSize(): `${number}px` {
    return !this.isMobile ? '480px' : '288px';
  }

  get drawerHeading(): string {
    return `Comments (${this.comments.length})`;
  }

  get sortedComments(): Comment[] {
    return [...this.comments].sort((a, b) => {
      const dateA = parseDate(a.timestamp);
      const dateB = parseDate(b.timestamp);
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB.getTime() - dateA.getTime();
    });
  }

  get textareaRows(): number {
    return this.isMobile ? 7 : 3;
  }

  get isCommentEmpty(): boolean {
    return this.commentText.trim().length === 0;
  }

  onClose() {
    this.close.emit();
  }

  handleClearComment() {
    this.commentText = '';
  }

  handleSaveComment() {
    console.log('Saving comment:', this.commentText);
    this.handleClearComment();
  }

  onCommentChange(event: GoabTextAreaOnChangeDetail) {
    this.commentText = event.value ?? '';
  }

  handleEditComment(commentId: number) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      this.editingCommentId = commentId;
      this.editingCommentText = comment.text;
    }
  }

  handleSaveEditComment() {
    if (this.editingCommentId !== null && this.editingCommentText.trim()) {
      this.editComment.emit({
        id: this.editingCommentId,
        text: this.editingCommentText,
      });
      this.editingCommentId = null;
      this.editingCommentText = '';
    }
  }

  handleCancelEditComment() {
    this.editingCommentId = null;
    this.editingCommentText = '';
  }

  onEditCommentChange(event: GoabTextAreaOnChangeDetail) {
    this.editingCommentText = event.value ?? '';
  }

  handleDeleteComment(commentId: number) {
    this.deleteCommentId = commentId;
    this.showDeleteCommentModal = true;
  }

  confirmDeleteComment() {
    if (this.deleteCommentId !== null) {
      this.deleteComment.emit(this.deleteCommentId);
    }
    this.showDeleteCommentModal = false;
    this.deleteCommentId = null;
  }

  cancelDeleteComment() {
    this.showDeleteCommentModal = false;
    this.deleteCommentId = null;
  }

  onCommentMenuAction(event: GoabMenuButtonOnActionDetail, commentId: number) {
    const action = event.action;
    if (action === 'edit') {
      this.handleEditComment(commentId);
    } else if (action === 'delete') {
      this.handleDeleteComment(commentId);
    }
  }
}
