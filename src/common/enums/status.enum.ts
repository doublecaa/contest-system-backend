export enum Status {
  Hide = 'hide', // ẩn
  Show = 'show', // hiển thị
  Lock = 'lock', // bị khoá
  Work = 'work', // hoạt động
  New = 'new', // mới
  NotYetExam = 'notYetExam', // chưa thi
  TakingExam = 'takingExam', // đang thi
  TookExam = 'tookExam', // đã thi
  Enrollment = 'enrollment', //  đang tuyển sinh
  BanExam = 'banExam', // cấm thi
  AllowExam = 'allowExam', // cho phép thi
  Wait = 'wait', // đợi duyệt
  Approve = 'approve', // đã duyệt
  Reject = 'reject', // từ chối
  Return = 'return', // điểu chỉnh
  Read = 'read', // đã đọc
  Unread = 'unread', // chưa đọc
}
