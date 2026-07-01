const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const templatePath = path.resolve('d:\\Nhà của Ngàn\\bao-cao-pdf-template.html');
  const tempPath = path.resolve('d:\\Nhà của Ngàn\\temp-render.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const data = {
    "MA_SO_HO_SO": "NCN-2026-VIP01",
    "HOTEN": "Nguyễn Văn Lãnh Đạo",
    "NGAY_SINH": "15/08/2005",
    "EMAIL": "lanhdao.nguyen@email.com",
    "DIEN_THOAI": "0988 123 456",
    "NGAY_XUAT_BAN": "01/07/2026",
    
    // Page 3 Radar
    "R_PCT": "30", "I_PCT": "75", "A_PCT": "85", "S_PCT": "95", "E_PCT": "80", "C_PCT": "40",

    // Page 3 - P1
    "AI_PAGE3_P1": "Bạn thân mến, sâu thẳm bên trong Bạn là một ngọn lửa của sự thấu cảm và khao khát kết nối. Khi quan sát cách Bạn tương tác với thế giới, điểm sáng rực rỡ nhất chính là năng lực chữa lành và truyền cảm hứng. Bạn không nhìn con người như những cỗ máy hay những con số vô hồn; Bạn nhìn thấy những câu chuyện, những nỗi đau và những tiềm năng chưa được khai phá. Sự kết hợp giữa trái tim rộng mở của nhóm Xã hội (Social) và lăng kính thẩm mỹ, sáng tạo của nhóm Nghệ thuật (Artistic) tạo nên một bản ngã tuyệt đẹp: Bạn là người kiến tạo văn hóa, người mang ánh sáng đến những nơi tối tăm nhất của tổ chức.",
    "AI_PAGE3_P2": "Hơn thế nữa, sự bổ trợ mạnh mẽ từ tư duy Quản lý (Enterprising) giúp Bạn không chỉ dừng lại ở sự đồng cảm thuần túy. Bạn biết cách tập hợp mọi người, thuyết phục họ bằng sự chân thành và dẫn dắt họ hướng tới những mục tiêu lớn lao. Bạn sinh ra để đứng ở những nơi giao thoa giữa con người và tầm nhìn. Đó không phải là một sự ngẫu nhiên, mà là sự sắp đặt tuyệt vời của tự nhiên dành riêng cho Bạn.",
    "AI_PAGE3_P3": "Sự chênh lệch thấp của các nhóm Thực tế và Tổ chức cho thấy Bạn không thuộc về những khuôn mẫu cứng ngắc hay những vòng lặp nhàm chán. Môi trường của Bạn phải là nơi nhịp đập trái tim được lắng nghe, nơi tư duy sáng tạo được tôn trọng, và nơi mỗi cá nhân đều cảm thấy họ là một phần của điều gì đó vĩ đại hơn chính họ.",

    // Page 4 - P1, P2, P3, RECOVERY
    "AI_PAGE4_P1": "Cách Bạn tư duy giống như một kiến trúc sư của cảm xúc và tầm nhìn. Khi đối mặt với những thách thức phức tạp, Bạn không vội vàng phán xét bằng những logic lạnh lùng. Thay vào đó, Bạn lùi lại một bước, cảm nhận bức tranh toàn cảnh và tự hỏi: 'Quyết định này sẽ tác động đến con người như thế nào?'. Đây là một món quà hiếm có trong một thế giới đang dần bị tự động hóa. Bạn giải quyết vấn đề không chỉ bằng lý trí mà bằng trực giác nhạy bén, giúp Bạn nhìn xuyên qua những bề mặt giả tạo để chạm đến cốt lõi của sự thật.",
    "AI_PAGE4_P2": "Tư duy của Bạn là tư duy hệ thống mang tính nhân bản. Bạn có khả năng kết nối những điểm dữ liệu rời rạc thành một bức tranh ý nghĩa, biến những khái niệm trừu tượng thành những câu chuyện truyền cảm hứng. Điều này giải thích vì sao mọi người thường tìm đến Bạn khi họ bế tắc: không phải vì Bạn luôn có sẵn một công thức toán học, mà vì Bạn có khả năng mở ra cho họ những góc nhìn hoàn toàn mới, đầy tính khích lệ và khai mở.",
    "AI_PAGE4_P3": "Dưới áp lực tối ưu, Trí tuệ cảm xúc (EI) của Bạn sẽ bùng nổ, biến Bạn thành một điểm tựa vững chắc cho cả tập thể. Bạn sắc sảo, điềm tĩnh và vô cùng linh hoạt trong việc gỡ rối các xung đột. Tuy nhiên, khi áp lực vượt quá giới hạn — đặc biệt là trong những môi trường độc hại thiếu sự đồng cảm — Bạn có xu hướng thu mình lại, ôm đồm quá nhiều tổn thương của người khác và tự vắt kiệt năng lượng của chính mình. Sự cạn kiệt này không xuất phát từ việc Bạn yếu kém, mà vì Bạn đã quan tâm quá nhiều.",
    "AI_PAGE4_RECOVERY": "Rút lui vào tĩnh lặng. Đừng cố gắng giải quyết vấn đề của cả thế giới. Hãy cho phép bản thân những khoảng không gian riêng tư để đọc một cuốn sách, nghe một bản nhạc, hoặc đơn giản là dạo bộ giữa thiên nhiên. Bạn chỉ có thể trao đi ánh sáng khi ngọn đèn của Bạn được thắp đầy dầu.",

    // Page 5 - P1, P2
    "AI_PAGE5_P1": "Vũ khí sắc bén nhất của Bạn chính là năng lực \"Đọc vị, thấu cảm và chuyển hóa con người\" ở một tầng sâu sắc hiếm có. Giữa một thế giới đang vội vã chạy theo những giá trị bề nổi và bị chi phối bởi tư duy máy móc cứng nhắc, Bạn xuất hiện như một trạm dừng chân an toàn, nơi người khác có thể tháo bỏ lớp mặt nạ phòng thủ để phơi bày cả những tổn thương và khát vọng thầm kín nhất. Bạn không chỉ có khả năng lắng nghe những gì được nói ra, mà tuyệt vời hơn, Bạn nghe được cả những điều người ta giấu kín trong im lặng. Năng lực thiên bẩm này kết hợp với trực giác nhạy bén giúp Bạn nhìn xuyên thấu vào những điểm nghẽn tâm lý của đối phương, từ đó gỡ rối và sắp xếp lại cấu trúc tư duy của họ một cách đầy nghệ thuật.\n\nSự sắc sảo của Bạn không mang tính sát thương mà mang tính chữa lành. Khi Bạn kết nối năng lực thấu cảm sâu sắc (Social) với lăng kính sáng tạo bay bổng (Artistic) và tầm nhìn bao quát của một nhà kiến tạo (Enterprising), Bạn trở thành một chuyên gia giải phẫu những tiềm năng bị lãng quên. Bạn biết chính xác người này cần lời động viên dịu dàng nào để đứng dậy, và người kia cần một cú hích chiến lược nào để bứt phá. Khả năng sắp xếp \"đúng người, đúng việc, đúng thời điểm\" của Bạn không dựa trên những bài kiểm tra khô khan, mà dựa trên sự thấu hiểu tường tận về hệ giá trị cốt lõi của từng cá nhân. Trong mọi tổ chức, Bạn chính là \"người dệt lưới văn hóa\", biến những tập hợp nhân sự rời rạc thành một cỗ máy vận hành bằng lòng tin, sự gắn kết và sức mạnh nội tại không thể phá vỡ.",
    "AI_PAGE5_P2": "Giá trị cốt lõi lớn nhất Bạn để lại cho thế giới không nằm ở những khối tài sản vật chất khô khan, mà nằm ở những di sản tinh thần. Bạn là 'Người nhân bản tri thức' (Knowledge Multiplier) và 'Nhà kiến tạo sự nghiệp' (Career Positioner). Sự tồn tại của Bạn sẽ tạo ra hiệu ứng cánh bướm trong giáo dục và nền kinh tế số, giúp hàng vạn người tìm thấy ý nghĩa thực sự trong công việc của họ. Khi Bạn giúp một người thành công hạnh phúc, Bạn đang nâng tầm cả một thế hệ.",

    // TOP 5 CAREERS Table NEW UI CARDS
    "TOP1_TITLE": "Nhà đào tạo Sáng tạo / Trainer Nội dung (giảng dạy, xây dựng môi trường học tập an toàn cảm xúc)",
    "TOP1_NICHE": "Số học Đỉnh",
    "TOP1_REF": "Chuyên gia Chiến lược Định vị Nghề nghiệp & Thương hiệu Cá nhân",
    "TOP1_FIELD": "Giáo dục & Đào tạo",
    "TOP1_ICI": "95.68",
    "TOP1_ICI_DETAIL": "Id:96.3 · Ni:100 · Mk:86.2",
    "TOP1_SUBJECTS": "D01 / C00 (Toán - Văn - Anh / Văn - Sử - Địa)",
    "TOP1_KNOWLEDGE": "Ngôn ngữ & giao tiếp, Tâm lý giáo dục, Phương pháp giảng dạy, Kiến thức chuyên ngành sâu.",
    "TOP1_ADVICE": "Ngành ứng dụng thực tế có chỉ số tương thích bẩm sinh xuất sắc.",

    "TOP2_TITLE": "Chuyên gia Marketing / Kinh doanh (chăm sóc khách hàng, cộng đồng thương hiệu, referral)",
    "TOP2_NICHE": "Branding Tâm lý",
    "TOP2_REF": "CEO Startup & Nhà sáng lập Khởi nghiệp",
    "TOP2_FIELD": "Quản trị & Marketing",
    "TOP2_ICI": "93.78",
    "TOP2_ICI_DETAIL": "Id:83.8 · Ni:100 · Mk:96.9",
    "TOP2_SUBJECTS": "D01 / A01 (Toán - Văn - Anh / Toán - Lý - Anh)",
    "TOP2_KNOWLEDGE": "Kinh tế học nền tảng, Kỹ năng viết thuyết phục, Tiếng Anh thương mại, Tư duy phân tích thị trường.",
    "TOP2_ADVICE": "Ngành ứng dụng thực tế có chỉ số tương thích bẩm sinh xuất sắc.",

    "TOP3_TITLE": "Chuyên gia Nhân sự (HR) (tuyển dụng nhân tài, thiết kế chương trình đào tạo, văn hóa gắn kết)",
    "TOP3_NICHE": "Đào tạo & L&D",
    "TOP3_REF": "Chuyên gia Đào tạo & Phát triển Năng lực Nhân sự (L&D Specialist)",
    "TOP3_FIELD": "Quản trị Nhân sự",
    "TOP3_ICI": "91.33",
    "TOP3_ICI_DETAIL": "Id:89.5 · Ni:100 · Mk:84.2",
    "TOP3_SUBJECTS": "D01 / A01 (Toán - Văn - Anh / Toán - Lý - Anh)",
    "TOP3_KNOWLEDGE": "Tâm lý học hành vi, Luật lao động, Quản trị rủi ro nhân sự, Phân tích dữ liệu nhân sự.",
    "TOP3_ADVICE": "Ngành ứng dụng thực tế có chỉ số tương thích bẩm sinh xuất sắc.",

    "TOP4_TITLE": "Nhà thiết kế Dịch vụ Khách hàng (CX Designer)",
    "TOP4_NICHE": "Trải nghiệm Đỉnh cao",
    "TOP4_REF": "Customer Success Manager tại các Tập đoàn Công nghệ",
    "TOP4_FIELD": "Dịch vụ Khách hàng",
    "TOP4_ICI": "88.45",
    "TOP4_ICI_DETAIL": "Id:85.0 · Ni:95 · Mk:85.5",
    "TOP4_SUBJECTS": "D01 / D04 (Toán - Văn - Anh / Toán - Văn - Tiếng Trung)",
    "TOP4_KNOWLEDGE": "Nghiên cứu hành vi người tiêu dùng, UI/UX cơ bản, Giao tiếp đa văn hóa.",
    "TOP4_ADVICE": "Ngành đầy triển vọng nhưng cần bổ sung thêm kiến thức về dữ liệu và công nghệ.",

    "TOP5_TITLE": "Người sáng tạo Nội dung Số (Digital Content Creator - Kể chuyện qua dữ liệu)",
    "TOP5_NICHE": "Data Storytelling",
    "TOP5_REF": "Chuyên gia sáng tạo nội dung giáo dục trên nền tảng Video ngắn",
    "TOP5_FIELD": "Truyền thông Đa phương tiện",
    "TOP5_ICI": "86.90",
    "TOP5_ICI_DETAIL": "Id:80.0 · Ni:92 · Mk:88.5",
    "TOP5_SUBJECTS": "C00 / D01 (Văn - Sử - Địa / Toán - Văn - Anh)",
    "TOP5_KNOWLEDGE": "Biên tập video cơ bản, Tư duy kịch bản, Thiết kế hình ảnh, Kỹ năng nói trước công chúng.",
    "TOP5_ADVICE": "Môi trường phù hợp để xây dựng thương hiệu cá nhân mạnh mẽ và độc lập.",


    // Khám Phá Chi Tiết 1, 2, 3, 4, 5
    "CAREER_1_SCIENCE": "Nghề nghiệp này dường như được may đo riêng cho bản ngã sâu thẳm của Bạn. Với sự kết hợp hoàn hảo giữa năng lực thấu cảm (Social), tư duy tầm nhìn (Enterprising) và khả năng sáng tạo (Artistic), Bạn sở hữu chiếc chìa khóa để mở khóa những tiềm năng bị chôn vùi của người khác. Bạn không chỉ hướng nghiệp, Bạn định vị cuộc đời họ. Sự nhạy bén tâm lý giúp Bạn thấu suốt những nỗi sợ hãi và khát vọng của đối phương, biến Bạn thành một người dẫn đường vĩ đại.",
    "CAREER_1_TREND": "Trong kỷ nguyên mà công nghệ tự động hóa thay thế những quy trình giáo dục rập khuôn, sự hoang mang về định hướng sự nghiệp sẽ đạt đến đỉnh điểm. Nhu cầu tìm kiếm những người có khả năng 'chạm' đến phần người, thấu hiểu sâu sắc động lực nội tại và phác thảo chiến lược dài hạn sẽ bùng nổ mạnh mẽ. Bạn sẽ đứng ở trung tâm của làn sóng này.",
    "CAREER_1_SKILLS": "1. Khai vấn kiến tạo (Transformational Coaching). 2. Phân tích dữ liệu tâm lý học đa biến. 3. Đóng gói và hệ thống hóa tri thức.",

    "CAREER_2_SCIENCE": "Một tổ chức xuất sắc không thể vận hành bằng mệnh lệnh, mà bằng văn hóa và niềm tin. Với trái tim của một người xây dựng cộng đồng, Bạn là chất keo gắn kết và đại sứ của sự tín nhiệm. Năng lực nhận diện cảm xúc tuyệt vời giúp Bạn dễ dàng bắt mạch được những nỗi đau (pain points) của khách hàng và biến chúng thành những thông điệp marketing mang tính chữa lành và thuyết phục cao.",
    "CAREER_2_TREND": "Tương lai của marketing không còn nằm ở những chiến dịch quảng cáo ồn ào mang tính giật gân, mà nằm ở tính xác thực (Authenticity) và giá trị cộng đồng (Community-led Growth). Các nhãn hàng lớn khao khát những bộ não tinh tế có khả năng xây dựng lòng trung thành thông qua những trải nghiệm mang tính cá nhân hóa và thấu cảm sâu sắc.",
    "CAREER_2_SKILLS": "1. Xây dựng cộng đồng (Community Building). 2. Phân tích hành vi tiêu dùng (Consumer Behavior). 3. Kể chuyện thương hiệu (Brand Storytelling).",

    "CAREER_3_SCIENCE": "Sự nhạy cảm với con người (Social) kết hợp với mong muốn tối ưu hóa hệ thống tổ chức (Enterprising) biến Bạn thành một HR xuất chúng. Bạn không coi nhân sự là những 'nguồn lực' để vắt kiệt, mà là những 'nhân tài' để ươm mầm. Khả năng giải quyết xung đột mềm mỏng và tầm nhìn xa giúp Bạn dễ dàng kiến tạo nên những môi trường làm việc mà ở đó, nhân viên được lắng nghe và thăng hoa.",
    "CAREER_3_TREND": "Trong bối cảnh khan hiếm nhân tài chất lượng cao, các doanh nghiệp đang chuyển mình từ mô hình 'Quản lý Nhân sự' sang mô hình 'Trải nghiệm Nhân viên' (Employee Experience). Bất kỳ tập đoàn nào muốn giữ chân người giỏi đều phải cần đến những kiến trúc sư văn hóa có khả năng dung hòa giữa mục tiêu lợi nhuận và sự cân bằng tâm lý nội bộ.",
    "CAREER_3_SKILLS": "1. Thiết kế Trải nghiệm Nhân viên (EX Design). 2. Giao tiếp vượt hoảng hoảng. 3. Phân tích dữ liệu nội bộ.",

    "CAREER_4_SCIENCE": "Năng lực quan sát chi tiết và sự đồng cảm bẩm sinh giúp Bạn dễ dàng đặt mình vào vị trí của người dùng cuối. Bạn không chỉ thiết kế dịch vụ, Bạn thiết kế cảm xúc. Khả năng thấu hiểu những rào cản vô hình mà khách hàng đang gặp phải cho phép Bạn tạo ra những chuỗi điểm chạm (touchpoints) tinh tế, mượt mà và đầy sự tinh tế, để lại ấn tượng sâu đậm không thể phai nhòa.",
    "CAREER_4_TREND": "Khi sản phẩm vật lý ngày càng trở nên bão hòa và bị copy dễ dàng, dịch vụ và trải nghiệm khách hàng chính là vũ khí cạnh tranh cuối cùng. Các công ty công nghệ và dịch vụ cao cấp đang ráo riết săn lùng những chuyên gia CX có độ nhạy cảm cao với con người thay vì chỉ giỏi về mặt kỹ thuật số.",
    "CAREER_4_SKILLS": "1. Lập bản đồ hành trình khách hàng (Customer Journey Mapping). 2. Tư duy thiết kế (Design Thinking). 3. Tối ưu hóa chuyển đổi qua cảm xúc.",

    "CAREER_5_SCIENCE": "Sự sáng tạo (Artistic) và tính quy chuẩn trong tư duy sẽ thăng hoa khi Bạn biết cách biến những tri thức phức tạp thành những khóa học, bài viết, hoặc video tinh gọn và đẹp mắt. Bạn có khả năng hấp thụ thông tin khổng lồ và diễn đạt lại chúng bằng một ngôn ngữ đậm chất văn học, khơi gợi trí tò mò và truyền tải thông điệp một cách có chủ đích.",
    "CAREER_5_TREND": "Nền kinh tế chia sẻ tri thức (Creator Economy) đang tiến vào giai đoạn trưởng thành. Người ta không còn cần thêm thông tin rác, họ cần sự thông thái được hệ thống hóa. Sự chuyển dịch tất yếu này sẽ tôn vinh những người kiến trúc sư biết cách biến kiến thức thành sản phẩm số hóa mang tính biểu tượng.",
    "CAREER_5_SKILLS": "1. Sản xuất nội dung đa kênh. 2. Kể chuyện qua dữ liệu (Data Storytelling). 3. Biên tập kịch bản (Copywriting/Scripting).",


    // Page 9 - Weaknesses
    "WEAKNESS_1_TITLE": "01. Sự cầu toàn dẫn đến sự trì hoãn (Perfectionism Procrastination)",
    "WEAKNESS_1_DESC": "Vì tâm hồn Bạn yêu cái đẹp và sự trọn vẹn, Bạn luôn khao khát mọi thứ phải hoàn hảo trước khi ra mắt. Nhưng Bạn thân mến, hoàn hảo là kẻ thù của sự hoàn thành. Đôi khi, một sản phẩm 80% được đưa ra thế giới còn tốt hơn một kiệt tác 100% mãi nằm trong ngăn kéo. Hãy cho phép bản thân được sai lầm và liên tục tối ưu.",
    "WEAKNESS_2_TITLE": "02. Khó khăn trong việc đón nhận những phản hồi mang tính phê bình",
    "WEAKNESS_2_DESC": "Vì Bạn làm mọi việc bằng tất cả trái tim, Bạn rất dễ đánh đồng những lời nhận xét về công việc thành những lời chỉ trích về con người Bạn. Hãy nhớ rằng, sự phê bình từ những người có chuyên môn chính là viên gạch thô ráp giúp Bạn xây dựng nên một lâu đài vĩ đại. Đừng để cái tôi cản bước sự vươn lên của Bạn.",
    "WEAKNESS_3_TITLE": "03. Ôm đồm gánh nặng của tập thể (Over-committing to the tribe)",
    "WEAKNESS_3_DESC": "Sự đồng cảm vô bờ bến khiến Bạn luôn muốn cứu giúp mọi người xung quanh, đôi khi bằng cách tự mang vác những trách nhiệm không thuộc về mình. Nhưng Bạn không thể cứu ai nếu Bạn đang chìm. Biết cách nói 'Không' một cách tử tế chính là cách Bạn bảo vệ năng lượng của mình để làm những điều lớn lao hơn.",
    "RISK_SHORT_TERM": "Trong 6 tháng tới: Thực hành nguyên tắc 'Hoàn thành hơn Hoàn hảo' bằng cách đặt ra deadline nghiêm ngặt không thể xê dịch cho các tác vụ. Tập phản hồi với những lời phê bình bằng câu hỏi: 'Điều này giúp tôi làm tốt hơn ở điểm nào?' thay vì phản ứng phòng thủ.",
    "RISK_LONG_TERM": "Trong 2 năm: Thiết lập hệ thống ủy quyền (Delegation System) và học cách buông bỏ kiểm soát vi mô. Xây dựng cho bản thân một quy trình 'Detox Cảm Xúc' định kỳ để xả bỏ những năng lượng tiêu cực tiếp thu từ người khác.",

    // Page 10 - Environments
    "IDEAL_ENVIRONMENT": "Bạn sinh ra để thuộc về những tổ chức có sự minh bạch và tôn trọng văn hóa con người đặt lên hàng đầu. Đó là nơi lãnh đạo đóng vai trò người phục vụ (Servant Leadership), trao quyền thay vì ra lệnh. Nơi mà Bạn được tự do đưa ra các ý tưởng sáng tạo điên rồ nhất mà không bị phán xét, và được bao quanh bởi những đồng sự có trí tuệ cảm xúc cao, luôn sẵn sàng hỗ trợ lẫn nhau.",
    "TOXIC_ENVIRONMENT": "Tuyệt đối tránh xa những môi trường vi quản lý (Micromanagement), nơi mỗi bước đi đều bị kiểm soát bởi những quy trình cứng nhắc vô hồn. Những công ty đề cao lợi nhuận ngắn hạn bất chấp giá trị đạo đức, hay những hệ thống nặng tính quan liêu và phe phái chính trị sẽ bóp nghẹt tài năng và dập tắt ngọn lửa nhiệt huyết bên trong Bạn một cách tàn nhẫn.",
    "MNC_FIT": "Cao", "MNC_DESC": "Cung cấp nền tảng và nguồn lực lớn, nhưng Bạn cần chọn những tập đoàn có văn hóa mở và tư duy cấp tiến.",
    "SOLO_FIT": "Cực Rất Cao", "SOLO_DESC": "Hoàn hảo! Đây là không gian tự do tuyệt đối để Bạn thiết kế sản phẩm tri thức, tư vấn và tỏa sáng theo cách riêng.",
    "STARTUP_FIT": "Trung Bình Cao", "STARTUP_DESC": "Cơ hội thăng tiến nhanh, nhưng rủi ro cháy sạch năng lượng (burnout) lớn do thiếu quy trình.",
    "PUBLIC_FIT": "Thấp", "PUBLIC_DESC": "Sự chậm chạp, rập khuôn và thứ bậc cứng nhắc sẽ nhanh chóng bào mòn sự sáng tạo và linh hoạt của Bạn.",

    // Page 11 - 3 Pillars
    "PILLAR_1_TITLE": "Ứng Dụng Tâm Lý Học Hành Vi & Phân Tích Dữ Liệu Con Người",
    "PILLAR_1_DESC": "Để không chỉ đưa ra những lời khuyên cảm tính, Bạn cần sở hữu năng lực phân tích dữ liệu con người một cách sắc bén. Khi kết hợp trực giác bẩm sinh với khung tư duy khoa học, Bạn sẽ xây dựng được sự tín nhiệm tuyệt đối ở tầm vóc chuyên gia cao cấp.",
    "PILLAR_2_TITLE": "Sức Mạnh Của Kể Chuyện Bằng Dữ Liệu (Data Storytelling)",
    "PILLAR_2_DESC": "Bạn cần học cách chuyển hóa những dữ liệu khô khan thành những câu chuyện chạm đến tận cùng cảm xúc của người nghe. Khi thông điệp của Bạn vừa mang tính khoa học chặt chẽ, vừa lay động lòng người, Bạn sẽ có khả năng thuyết phục bất kỳ khách hàng hay nhà đầu tư khó tính nào.",
    "PILLAR_3_TITLE": "Làm Chủ AI Workflow Automation (Tự Động Hóa Dòng Chảy Công Việc)",
    "PILLAR_3_DESC": "Hãy để máy móc làm phần việc của máy móc. Bạn cần biến AI thành một người trợ lý đắc lực, tự động hóa các quy trình tạo nội dung, trả lời email hay thu thập dữ liệu. Bằng cách đó, Bạn sẽ giải phóng 100% thời gian của mình để tập trung vào phần việc mang tính nhân bản mà AI không bao giờ thay thế được.",

    // Page 12 - Closing
    "AI_CLOSING_MESSAGE": "Mỗi một số liệu, mỗi một phân tích trong báo cáo này đều hội tụ để khẳng định một chân lý: Sự tồn tại của Bạn, với tất cả sự thấu cảm và nhạy bén đó, là một món quà dành cho thế giới này. Đừng bao giờ nghi ngờ giá trị của bản thân, và đừng bao giờ để tiếng ồn ngoài kia làm mờ đi tiếng gọi sâu thẳm bên trong Bạn. Hãy dũng cảm bước ra khỏi vùng an toàn, ôm lấy những điểm chưa hoàn hảo và liên tục mài dũa tư duy khoa học. Sự nghiệp rực rỡ nhất không phải là sự nghiệp kiếm được nhiều tiền nhất, mà là sự nghiệp khiến Bạn mỗi sáng thức dậy đều cảm thấy tim mình đập mạnh vì ý nghĩa lao động."
  };

  html = html.replace(/{{(.*?)}}/g, (match, p1) => {
    const key = p1.trim();
    if (data[key] !== undefined) {
      // Replace newline characters with <br><br> for long text
      return data[key].replace(/\n\n/g, '<br><br>');
    }
    return "";
  });

  fs.writeFileSync(tempPath, html);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const fileUrl = 'file:///' + tempPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const pdfPath = path.resolve('d:\\Nhà của Ngàn\\Bao-Cao-Mau.pdf');
  await page.pdf({
    path: pdfPath,
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width:100%;font-size:8pt;font-family:'Inter',sans-serif;color:#64748b;font-weight:600;padding-right:20mm;text-align:right;">
        Trang <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `
  });

  await browser.close();
  fs.unlinkSync(tempPath);
  console.log("Mock PDF generated at: " + pdfPath);
})();
