# Báo cáo thí nghiệm cuối — Project 02: Agent-Readable Workspace

**Ngày tổng hợp:** 19-10-2026  
**Thư mục thí nghiệm:** `D:\harness-p02-experiment`  
**Phạm vi:** đối chiếu `run-a` (Weak Starter Harness) và `run-b` (Improved Harness), gồm `AGENTS.md`, `feature_list.json`, `session-handoff.md`, docs, source code và các ghi nhận build/test có sẵn. Không sửa nội dung của hai run.

## 1. Mục tiêu và thiết lập

Project 02 đánh giá liệu một workspace dễ đọc cho agent có hỗ trợ công việc qua nhiều session hay không. Phạm vi sản phẩm gồm Document Import, Document Detail và Basic Persistence trong ứng dụng Electron Knowledge Base. Session A tập trung import/detail; Session B tập trung khôi phục metadata và nội dung tài liệu sau khi đóng rồi mở lại ứng dụng.

Hai run là hai checkout riêng trong cùng thư mục thí nghiệm. `run-a/AGENTS.md` là hướng dẫn ngắn với Quick Start, phân lớp và một số convention. `run-b/AGENTS.md` bổ sung mission, thứ tự đọc bắt buộc, quy tắc architecture, workflow, tiêu chí trạng thái feature, hợp đồng handoff và completion criteria. So sánh dưới đây dựa trên các file đang có và ghi nhận kết quả; không có phép đo token hay thời gian session để định lượng hiệu suất.

**Cách đọc bằng chứng:** “Quan sát” là nội dung trực tiếp có trong tracker, handoff, log hoặc source. “Diễn giải” là kết luận thận trọng rút ra từ các quan sát đó.

## 2. Weak Harness và Improved Harness

| Khía cạnh | Weak Harness — Run A | Improved Harness — Run B |
|---|---|---|
| Hướng dẫn agent | Quick Start, layer map, conventions ngắn. | Nêu mission và required reading order; yêu cầu xác minh handoff với repo. |
| Quy trình | Không có workflow session chi tiết trong AGENTS.md. | Ghi baseline, chỉ sửa phạm vi cần thiết, chạy check/build, yêu cầu GUI verification và cập nhật tracker/handoff. |
| Ngữ nghĩa trạng thái | AGENTS.md không định nghĩa status. | Định nghĩa `not-started`, `in-progress`, `implemented-unverified`, `pass`, `fail`; nhấn mạnh build không thay thế GUI test. |
| Handoff | File Run A tích lũy nhiều ghi chú và diễn biến; một số phần nói về Run B. | Handoff Run B có mục tiêu, thay đổi, kiểm chứng riêng, known issues và next steps. |
| Cấu hình build liên quan | Initial build log ghi Vite lấy PostCSS config ở `D:\postcss.config.js` và lỗi thiếu `@tailwindcss/postcss`; initial check ghi 15 TypeScript errors. `vite.config.ts` trong run đặt `css.postcss.plugins: []` để cô lập config cha. | `vite.config.ts` cũng đặt PostCSS plugins rỗng; handoff ghi `npm.cmd run check` và `npm.cmd run build` pass. Preload runtime fix tại Run B dùng const enum cục bộ. |
| Kết quả ghi nhận | `run-a-session-a-result.md` báo check/build, window, import và detail pass; Persistence chưa test tại thời điểm Session A. | `feature_list.json` ghi Import/Detail partially verified, Persistence pass theo manual restart test. |

**Diễn giải:** Improved Harness làm rõ hơn quy trình, tiêu chuẩn bằng chứng và cách bàn giao. Điều này giúp người đọc sau có căn cứ kiểm tra lại trạng thái. Các tài liệu hiện có không chứng minh Improved Harness làm việc nhanh hơn; không có token count, thời lượng hay phép đo đối chứng tương đương.

## 3. Kết quả Session A theo từng run

### Run A — Weak Harness

**Quan sát:** `run-a-initial-check.txt` ghi `npm run check` thất bại với 15 TypeScript errors, gồm import sai đường dẫn `shared/types`, unused imports/variables, kiểu `File.path` và implicit `any`. `run-a-initial-build.txt` ghi build thất bại khi Vite nạp config ngoài workspace tại `D:\postcss.config.js` và không tìm thấy `@tailwindcss/postcss`. `run-a-session-a-result.md` sau đó ghi check/build pass, Electron window pass, Document Import manual GUI pass, Document Detail manual GUI pass; Basic Persistence được để lại cho Session B. Handoff Run A ghi thêm preload bridge runtime bug fix.

**Diễn giải:** Session A trong Run A đã chuyển từ lỗi check/build ban đầu tới kết quả session được báo thành công cho luồng import/detail. Tuy nhiên, báo cáo kết quả ngắn không liệt kê từng test case, nên không đủ để kết luận mọi nhánh của feature đã được xác minh.

### Run B — Improved Harness

**Quan sát:** Handoff ghi check và build pass sau các sửa đổi preload; feature tracker được cập nhật sau đó với kết quả GUI ngày 2026-10-19: import một file `.txt` thành công, file xuất hiện trong document list, chọn file hiển thị metadata và toàn bộ text. Tracker giữ Document Import và Document Detail ở `implemented-partially-verified`. Các trường hợp `.md`, hủy file picker, định dạng không hỗ trợ, giới hạn 10 MB và biên giới hạn chưa được test thủ công; Delete cũng chưa được test thủ công.

**Diễn giải:** Run B cung cấp bằng chứng hẹp nhưng cụ thể hơn trong tracker và chủ động giữ trạng thái chưa hoàn tất cho các nhánh chưa chạy. Chỉ nên khẳng định luồng `.txt` cơ bản đã kiểm tra qua GUI.

## 4. So sánh khôi phục context ở Session B

**Quan sát:** Handoff Run B xác định mục tiêu Session B là Basic Persistence, liệt kê file đã đổi (`src/renderer/App.tsx`, tracker, handoff), phân biệt check/build tự động với manual GUI verification, mô tả dữ liệu persistence và nêu các feature còn chưa xác minh. `run-b/feature_list.json` ghi Persistence pass sau khi người dùng đóng hoàn toàn Electron, mở lại mà không import lại, và xác nhận metadata cùng full content được phục hồi.

Trong khi đó, `run-a/session-handoff.md` dài và tích lũy nhiều phần: ghi chú ban đầu về bundling, probe runtime, một phần “Run B follow-up”, hướng dẫn Session B và kết quả cuối cùng. Handoff này cũng nhắc cần xác nhận bằng chứng Persistence có áp dụng cho Run B hay không. Vì vậy nội dung trong nó không thể được coi là trạng thái hiện hành duy nhất của một checkout.

**Diễn giải:** Handoff của Run B có cấu trúc giúp phục hồi mục tiêu, trạng thái, bằng chứng và việc còn lại dễ đối chiếu. Tài liệu Run A làm tăng nguy cơ nhầm phạm vi vì có lịch sử nhiều pha và nhắc đến Run B; cần kiểm tra tracker/source của đúng run. Đây là so sánh về khả năng đọc/khôi phục context từ artifacts, không phải phép đo chất lượng suy luận hay tốc độ agent.

## 5. Basic Persistence: implementation và manual verification

**Quan sát từ Run B source/handoff:** `src/main/main.ts` khởi tạo service bằng `app.getPath('userData')/knowledge-base-data` trước khi tạo window. `PersistenceService` tạo thư mục dữ liệu, hỗ trợ đọc/ghi JSON và text. `DocumentService.importDocument()` ghi metadata vào `documents-meta.json` và nội dung đầy đủ vào `content/<id>.txt`; `listDocuments()` đọc metadata. IPC handlers expose list và content retrieval. `App.tsx` có mount effect gọi `refreshDocuments()`, nạp lại danh sách khi renderer khởi động. `DocumentDetail.tsx` yêu cầu nội dung theo document ID và render nội dung đầy đủ.

**Manual verification ghi nhận trong Run B:** sau khi import `test-document.txt`, Electron được đóng hoàn toàn rồi khởi chạy lại. Tài liệu tự xuất hiện mà không import lại, metadata có sẵn và full content mở được. Tracker đặt `basic-persistence` là `pass`. Handoff đồng thời ghi riêng `npm.cmd run check` và `npm.cmd run build` đã pass; đây là automated verification, tách biệt với GUI restart test.

**Diễn giải:** Bằng chứng người dùng xác nhận bao phủ tiêu chí tồn tại qua một lần restart cho dữ liệu được thử. Không có bằng chứng ở đây về nhiều phiên bản ứng dụng, nhiều tài liệu/khối lượng lớn, hỏng file hoặc di chuyển thư mục dữ liệu.

## 6. Preload runtime issue và cách sửa

**Quan sát:** Handoff ghi lỗi Electron cụ thể: `Unable to load preload script ...` và `module not found: ../shared/types`. Khi preload lỗi trước `contextBridge.exposeInMainWorld`, renderer không có `window.knowledgeBase`, dẫn tới lỗi truy cập `documents` là undefined. Source hiện tại của Run B `src/preload/preload.ts` không import `../shared/types`; thay vào đó khai báo local `const enum IPC_CHANNELS`, để channel string được inline. Handoff ghi đã inspect output build: preload chỉ require `electron`, có gọi `contextBridge.exposeInMainWorld`, không còn dependency `shared/types`; check/build pass. Cấu hình bảo mật `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false` được giữ nguyên. Run A còn mô tả một hướng xử lý bundling preload bằng Vite; đó là diễn biến lịch sử khác trong handoff tích lũy.

**Diễn giải:** Bằng chứng cuối cùng gắn với lỗi `../shared/types` chỉ ra fix loại bỏ runtime dependency ứng dụng khỏi sandboxed preload, thay vì tắt sandbox. Cần giữ local enum đồng bộ với channel definitions trong shared types. Kiểm tra bundle và log bridge startup không tự nó xác minh toàn bộ GUI import/detail; manual test `.txt` sau đó xác minh đường đi cơ bản.

## 7. Sự cố nhầm workspace: ảnh hưởng và khôi phục

**Quan sát:** `run-a/session-handoff.md` chứa phần có tiêu đề “Run B follow-up” và ghi lỗi với đường dẫn `D:\harness-p02-experiment\run-b\dist\preload\preload.js`, cùng hướng dẫn kiểm chứng dành cho checkout Run B. Trong cùng file, một số đoạn trước đó mô tả trạng thái Run A và trạng thái GUI còn pending; các đoạn sau ghi kết quả cuối cùng. Handoff cũng cảnh báo xác nhận Persistence ở checkout đích thay vì suy ra từ tracker Run A. Ngược lại, `run-b/session-handoff.md` và `run-b/feature_list.json` chứa kết quả Persistence cụ thể cho Run B.

**Ảnh hưởng quan sát được:** thông tin handoff không còn gắn nhất quán với một workspace duy nhất, làm mờ run nào là target và bằng chứng nào áp dụng cho run nào. Các artifacts được đọc không chứng minh source code của Run B bị ghi đè hoặc mất do sự cố, nên không khẳng định tác động đó.

**Khôi phục:** đối chiếu lại từng checkout theo đường dẫn, dùng `run-b/AGENTS.md`, `run-b/session-handoff.md`, `run-b/feature_list.json` và source Run B để xác định trạng thái; coi Run A tracker/handoff là bằng chứng lịch sử riêng, không dùng làm kết quả Persistence cho Run B. Kết quả cuối Run B hiện ghi nhận Basic Persistence pass từ manual restart test. Đây là khôi phục ranh giới evidence; tài liệu hiện có không mô tả một thao tác rollback code cụ thể.

## 8. Bảng so sánh dựa trên bằng chứng

| Tiêu chí | Run A — Weak Harness | Run B — Improved Harness | Mức độ kết luận |
|---|---|---|---|
| Check/build ban đầu | Log có 15 TypeScript errors; build vấp parent PostCSS config. | Handoff cuối ghi `npm.cmd run check` và `npm.cmd run build` pass. | Có bằng chứng trạng thái trước/sau không đồng thời và không phải benchmark đối chứng. |
| Session A import/detail | Session result ghi manual GUI pass; ít chi tiết test case. | Tracker ghi manual `.txt` import/list/detail và giữ trạng thái partially verified. | Run B có mô tả phạm vi xác minh rõ hơn; `.md` và nhánh phụ chưa test. |
| Preload | Session result nói cần runtime fix; handoff Run A ghi các diễn biến bundling/probe. | Handoff và source ghi lỗi `../shared/types`, local const enum, bundle không còn dependency đó. | Root cause/fix cuối có evidence cụ thể trong Run B; lịch sử Run A không hoàn toàn nhất quán theo phiên bản. |
| Persistence | Run A tracker có pass manual restart, nhưng handoff lịch sử yêu cầu xác nhận áp dụng cho checkout nào. | Run B tracker/handoff ghi test restart của chính Run B và kết quả metadata/full content. | Chấp nhận Run B pass dựa trên evidence gắn checkout; không chuyển kết quả giữa run. |
| Handoff/context | Tài liệu dài, tích lũy và lẫn nhắc đến Run B. | Mục tiêu, sửa đổi, kết quả, issue và next steps có cấu trúc. | Cấu trúc Run B thuận lợi hơn để phục hồi trạng thái từ artifacts. |
| Tốc độ/chi phí agent | Không có token count hoặc thời lượng. | Không có token count hoặc thời lượng. | Không thể kết luận run nào nhanh hơn hoặc rẻ hơn. |

## 9. Giới hạn và bài học

- Document Import và Document Detail chỉ **partially verified**: `.txt` path đã chạy; Import `.md`, cancel, unsupported extension, giới hạn 10 MB và boundary chưa chạy. Delete chưa manual test.
- Build/check pass chỉ xác nhận các lớp tự động tương ứng; không thay thế GUI testing.
- Persistence pass dựa trên một manual restart test được ghi nhận; phạm vi không đủ để khái quát độ bền trong mọi tình huống.
- `app.getPath('userData')` phụ thuộc ứng dụng/Electron userData. Nếu hai checkout dùng chung application identity và cùng userData trên máy, dữ liệu có thể bị contamination/chia sẻ giữa Run A và Run B. Các file hiện có không chứng minh hai run đã dùng chung hay riêng data directory; vì vậy cần coi đây là rủi ro validity của thí nghiệm, không phải sự kiện đã xác nhận.
- Handoff nên ngắn, gắn rõ tên checkout, mục tiêu, commit/source state nếu có, bằng chứng và việc chưa xong. Lịch sử cần phân biệt với trạng thái cuối để tránh đọc nhầm ghi chú cũ thành kết luận hiện tại.
- Harness rõ ràng hơn giúp yêu cầu evidence có thể kiểm tra được. Muốn khẳng định tác động lên tốc độ/chi phí cần ghi nhận token, thời gian và cùng một protocol cho cả hai run.

## 10. Kết luận cuối

Bằng chứng hiện có cho thấy Improved Harness (Run B) cung cấp chỉ dẫn và handoff rõ ràng hơn để agent tiếp tục qua session, đồng thời tracker giữ đúng mức chưa hoàn tất cho các phần Import/Detail chưa kiểm tra. Run B có implementation tự load danh sách khi khởi động và có manual restart verification ghi nhận cho Basic Persistence. Preload runtime failure được xử lý bằng cách bỏ runtime import `../shared/types` khỏi sandboxed preload, giữ nguyên cấu hình bảo mật.

Kết luận này là về độ rõ và khả năng truy nguyên của artifacts trong thí nghiệm. Nó không chứng minh Improved Harness nhanh hơn. Sự nhầm workspace trong tài liệu Run A cho thấy ranh giới checkout phải được xác nhận trước khi mang kết quả qua session; thêm vào đó, khả năng dùng chung Electron userData có thể gây nhiễu so sánh. Import và Detail vẫn chỉ partially verified.
