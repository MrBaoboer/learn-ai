/* 제6편 챕터 자가 평가 문제 은행 · Grok Build 해부 (50문항: 단답형 26 / 복수정답 10 / 판단형 14)
   g = 출제 그룹 번호 (이 챕터는 601-650 사용), exp = 정답 해설 */
window.EXAM_BANK = [
 {
  "g": 601,
  "type": "single",
  "q": "루트 Cargo.toml에 따르면 Grok Build workspace 멤버는 79개입니다. 강의 내용상 이 소스 조직 방식에 가장 가까운 설명은?",
  "opts": [
   "79개 멤버가 진입점·UI·도구·인프라 네 개의 최상위 디렉터리에 고르게 나뉘며 각 디렉터리에 약 20개 crate가 있습니다",
   "주축인 62개 멤버가 crates/codegen/ 아래에 집중되어 있으며, 읽을 때는 조합 진입점·TUI·Shell 호스트·도메인 능력·추론과 상태라는 다섯 축을 따라갑니다",
   "79개 멤버는 모두 독립 배포 가능한 바이너리이며, 제품은 프로세스 간 통신으로 이들을 조합합니다",
   "루트 Cargo.toml은 유지보수자가 수동으로 관리하며, crate를 추가·삭제할 때마다 멤버 목록을 사람이 동기화해야 합니다"
  ],
  "ans": 1,
  "exp": "79개 멤버는 workspace 사실이고, 그중 62개는 crates/codegen/에 모이며 나머지는 build·common·prod·third_party입니다. 강의는 다섯 축으로 읽으라고 강조하며, 가상의 4층 디렉터리 구조를 씌우지 말라고 경고합니다. 루트 Cargo.toml 첫 줄은 자동 생성된 workspace root라고 명시합니다."
 },
 {
  "g": 602,
  "type": "single",
  "q": "Session 런타임의 세 핵심 Actor 역할 분담에 대한 설명으로 올바른 것은?",
  "opts": [
   "SessionActor가 conversation과 token 상태를 직접 소유하고, ChatStateActor는 그 상태를 디스크에만 저장합니다",
   "SessionActor는 turn을 조율하고, ChatStateActor는 대화·token 상태를 전담 소유하며, SamplerActor는 모델 요청과 스트리밍 이벤트를 처리합니다",
   "SamplerActor가 전체 대화 기록을 보유합니다. 샘플링 요청에 전체 컨텍스트가 필요하기 때문입니다",
   "세 Actor가 공유 메모리 락으로 같은 세션 상태를 동시에 읽고 쓰며 메시지 전달 비용을 줄입니다"
  ],
  "ans": 1,
  "exp": "SessionActor는 run_session으로 명령·이벤트를 받아 turn loop를 진행합니다. ChatStateActor는 conversation·token·설정·persistence를 전담하고 mpsc로 직렬 처리하며 공유 락이 없습니다. SamplerActor는 요청마다 스트리밍 샘플링 태스크를 만듭니다. 상태마다 유일한 소유자가 있는 것이 핵심입니다."
 },
 {
  "g": 603,
  "type": "single",
  "q": "Grok Build의 실제 프로그램 진입점과 실행 분기에 대한 설명으로 올바른 것은?",
  "opts": [
   "TUI·headless·stdio Agent·leader가 각각 독립 main 바이너리를 갖고 통일 진입점이 없습니다",
   "실제 진입점은 xai-grok-shell의 run_leader이며, 나머지 모드는 leader 프로세스에서 다시 분배됩니다",
   "실제 진입점은 xai-grok-pager-bin/src/main.rs이며, 여기서 headless·stdio Agent·leader·대화형 TUI 네 분기를 나눕니다",
   "진입점은 xai-grok-sampler이며, 먼저 모델 연결을 만든 뒤 UI와 세션 호스트를 시작합니다"
  ],
  "ans": 2,
  "exp": "하나의 조합 진입점 main()이 명령과 상호작용 모드를 파싱합니다. run_headless는 헤드리스 호스트, run_stdio_agent는 ACP stdio, run_leader는 장기 수명 Agent, 기본 대화형 분기는 pager의 app::run으로 들어갑니다. 이후 connect_or_spawn·MvpAgent·spawn_session_on_thread를 거쳐 SessionActor와 SamplerActor에 도달합니다."
 },
 {
  "g": 604,
  "type": "single",
  "q": "세션 취소 메커니즘과 Agent 가변성에 대해 소스 사실과 맞는 것은?",
  "opts": [
   "취소는 고우선순위 메시지를 큐 앞에 넣어, 진행 중인 도구 호출을 즉시 선점합니다",
   "취소는 CancellationToken으로 협력적으로 마무리되며, 모든 handle이 drop되면 Actor 루프도 끝납니다. Agent는 구축 후 사실상 불변이지만 finalize_prompt라는 명시적 재렌더 진입점을 남깁니다",
   "Agent는 구축 후 절대 불변이며 system prompt를 포함한 어떤 필드도 갱신할 수 없습니다",
   "취소는 OS가 Session 스레드를 강제 종료하는 방식이며 Actor 협력은 필요 없습니다"
  ],
  "ans": 1,
  "exp": "취소는 협력식입니다. CancellationToken이 종료를 트리거하고, handle가 모두 버려져도 루프가 끝납니다. ‘고우선순위 큐 삽입’ 일반 설계나 강제 스레드 종료는 없습니다. Agent 주석은 effectively immutable이지만 finalize_prompt(&mut self)로 빌드 시각을 갱신하고 prompt를 다시 렌더할 수 있어 절대 불변이라고 말할 수 없습니다."
 },
 {
  "g": 605,
  "type": "single",
  "q": "CompactionPolicy 기본값으로 올바른 조합은?",
  "opts": [
   "임계값 80%, memory flush 기본 켜짐, two-pass 기본 켜짐, 벽시계 예산 600초",
   "임계값 85%, memory flush 기본 꺼짐, two-pass 기본 꺼짐, 벽시계 예산 300초",
   "임계값 85%, memory flush 기본 켜짐, two-pass 기본 꺼짐, 벽시계 예산 300초",
   "임계값 90%, memory flush 기본 꺼짐, two-pass 기본 켜짐, 벽시계 예산 300초"
  ],
  "ans": 1,
  "exp": "Default 구현에서 auto_compact_threshold_percent는 85, wall_clock_budget_secs는 300이며, memory_flush_enabled와 two_pass_enabled는 모두 false, compact_model은 None(미지정 시 현재 Session 모델)입니다. memory flush와 two-pass는 명시적으로 켠 뒤에야 해당 경로로 들어갑니다."
 },
 {
  "g": 606,
  "type": "single",
  "q": "context_window = 1,000, threshold = 85일 때 exceeds_threshold 판정으로 올바른 것은?",
  "opts": [
   "used = 850은 false를 반환하며, 850을 엄격히 초과해야 트리거됩니다",
   "used = 849와 850 모두 true를 반환합니다. 부동소수점 반올림이 트리거 지점을 앞당기기 때문입니다",
   "used = 850은 true(등호에서 즉시 트리거), used = 849는 false입니다",
   "context_window = 0이면 true를 반환하여 가장 보수적으로 강제 압축합니다"
  ],
  "ans": 2,
  "exp": "판정은 정수 포화 교차곱을 씁니다: used × 100 >= context_window × threshold_percent. 등호에서 바로 true이며 850 × 100은 1000 × 85와 같습니다. 정수 연산으로 부동소수점 경계 이동을 피합니다. context_window = 0이면 함수는 바로 false를 반환합니다."
 },
 {
  "g": 607,
  "type": "single",
  "q": "ToolKind::is_read_only() 기본 분류에 대한 설명으로 올바른 것은?",
  "opts": [
   "Task는 읽기 전용 분기에 속합니다. 서브태스크가 파일을 직접 수정하지 않기 때문입니다",
   "WebFetch는 비읽기 전용 분기에 속합니다. 외부 네트워크에 접근해 부작용이 생기기 때문입니다",
   "Task는 false 분기에 있고, Read·Search·WebFetch·AskUser 등은 true 분기에 있습니다",
   "소스에는 TaskOutput kind가 있어 태스크 산출물 되쓰기를 특별히 나타냅니다"
  ],
  "ans": 2,
  "exp": "tool_taxonomy.rs에서 Read·Search·Lsp·ListDir·MemorySearch·WebSearch·WebFetch·EnterPlan·AskUser 등은 true, Edit·Write·Execute·Task 등은 false이며 Task는 명시적으로 false입니다. TaskOutput kind는 없고 Execute 표시 라벨은 Run Command입니다."
 },
 {
  "g": 608,
  "type": "single",
  "q": "외부 Toolset preset 레지스트리에서 Public과 Internal의 차이에 대한 설명으로 올바른 것은?",
  "opts": [
   "Internal preset은 어떤 방식으로도 해석할 수 없으며 crate 내부 단위 테스트용입니다",
   "핵심 차이는 공개 열거에 들어가는지 여부입니다. Internal은 preset_names에 안 나오지만 이름으로 해석은 가능합니다",
   "Internal preset을 등록하면 이미 해석된 모든 ToolServerConfig에 자동으로 되씁니다",
   "Public preset은 관리자 승인 후에야 세션 설정에서 참조할 수 있습니다"
  ],
  "ans": 1,
  "exp": "레지스트리는 이름→빌더 함수와 가시성 매핑을 둡니다. 가시성은 열거 범위만 정합니다. Public은 preset_names와 공개 집합에 들어가고, Internal은 공개 열거되지 않지만 toolset_for_preset으로 이름 해석은 됩니다. 늦은 등록은 이미 해석된 설정에 되쓰지 않으며, 이후 해석에서만 새 항목이 보입니다."
 },
 {
  "g": 609,
  "type": "single",
  "q": "런타임에 발견된 대량의 MCP 도구에 대해, Grok Build는 모델의 도구 목록을 라운드 간에 어떻게 안정적으로 유지합니까?",
  "opts": [
   "모든 MCP 도구 정의를 system prompt에 넣고 모델이 고르게 합니다",
   "SearchTool이 BM25로 도구와 input_schema를 찾고, 고정 진입점 UseTool이 tool_name과 tool_input을 들고 호출을 분배합니다",
   "새 MCP 도구가 발견될 때마다 세션을 재시작해 전체 도구 등록표를 다시 만듭니다",
   "MCP 도구는 세션 시작 전 정적 등록만 가능하며, 런타임 발견 도구는 버립니다"
  ],
  "ans": 1,
  "exp": "SearchTool은 ToolIndex에서 BM25로 MCP 도구를 검색해 설명과 input_schema를 반환합니다. UseTool은 tool_name(보통 server__tool)과 schema에 맞춘 tool_input을 받아 InnerDispatch 또는 managed gateway로 실행합니다. 두 고정 메타 도구 덕분에 많은 MCP 도구를 프롬프트에 상주시킬 필요가 없습니다."
 },
 {
  "g": 610,
  "type": "single",
  "q": "기억 검색 중 query embedding이 실패하면 시스템은 어떻게 합니까?",
  "opts": [
   "검색 전체가 즉시 실패하고 나중에 다시 시도하라고 안내합니다",
   "경고를 남기고 None을 넘기며, FTS 후보는 병합 파이프라인에 들어가 FTS 전용으로 저하됩니다",
   "백업 embedding 제공자로 자동 전환해 세 번 재시도한 뒤 포기합니다",
   "질의 전 dirty 파일 동기화를 건너뛰고 마지막 캐시 결과를 그대로 반환합니다"
  ],
  "ans": 1,
  "exp": "hybrid_search에서 embed_batch가 오류를 내면 tracing::warn만 남기고 query_embedding을 None으로 둔 채 hybrid_search_merge로 이어집니다. FTS5 BM25는 항상 기본 후보를 제공합니다. embedding 실패가 전체 검색 실패를 뜻하지 않으며, 이것이 우아한 저하 보장입니다."
 },
 {
  "g": 611,
  "type": "single",
  "q": "Dream 기억 통합이 어떻게 트리거되는지에 대해 소스 사실과 맞는 것은?",
  "opts": [
   "프로세스 유휴 시 항상 자동 실행되며 별도 설정이 필요 없습니다",
   "소스는 세션 종료와 /dream 명령 트리거를 지원합니다. 기본 check_interval_secs는 None이며, 간격이 설정된 때에만 세션 Actor가 주기적 게이트 검사를 합니다",
   "Dream은 사용자가 /dream을 실행할 때만 트리거되며 세션 종료는 게이트에 들어가지 않습니다",
   "Sub-Agent 세션 종료도 Dream을 트리거하여 서브태스크 기억을 바로 병합합니다"
  ],
  "ans": 1,
  "exp": "진입점은 세션 종료·선택적 주기 검사·수동 /dream 세 가지입니다. 기본 check_interval_secs가 None이면 주기 검사가 꺼져 ‘유휴 시 자동’은 틀립니다. 트리거 후 enabled(기본 true)·min_hours(기본 4)·min_sessions(기본 3) 세 게이트를 통과해야 합니다. Sub-Agent 세션은 Dream을 건너뜁니다."
 },
 {
  "g": 612,
  "type": "single",
  "q": "다섯 가지 샌드박스 Profile의 실제 능력 경계에 대한 설명으로 올바른 것은?",
  "opts": [
   "workspace Profile은 workspace 밖 파일 읽기를 모두 금지합니다",
   "strict Profile은 workspace에도 쓸 수 없는 완전 읽기 전용 모드입니다",
   "strict는 전역 기본 읽기를 끄고 서브프로세스 네트워크를 제한하지만 workspace는 여전히 쓸 수 있습니다. read-only는 workspace 쓰기를 막되 GROK_HOME·임시 디렉터리 등 필수 쓰기 경로는 남깁니다",
   "off는 커스텀 Profile의 extends 베이스로 쓰여 규칙을 처음부터 정의할 수 있습니다"
  ],
  "ans": 2,
  "exp": "강의가 강조하는 흔한 오해는 둘입니다. workspace도 workspace 밖 읽기가 가능하고, strict도 workspace 쓰기가 가능합니다. read-only는 운행에 필요한 최소 쓰기 디렉터리를 남깁니다. Profile 이름은 방향만 가리키며, 실제 경계는 해석된 capability set을 봐야 합니다. off는 별칭 none을 받으며 커스텀 extends 베이스로 쓸 수 없습니다."
 },
 {
  "g": 613,
  "type": "single",
  "q": "PreToolUse Hook 프로세스가 결과를 반환하지 않고 타임아웃되면 이 도구 호출은 어떻게 됩니까?",
  "opts": [
   "차단됩니다. 타임아웃은 가장 보수적인 거부로 취급됩니다",
   "Hook가 돌아오거나 사용자가 취소할 때까지 무한히 대기합니다",
   "통과시키고 경고를 남깁니다. Hook 실행 실패는 fail-open으로 취급됩니다",
   "사용자 확인 팝업으로 넘겨 계속 여부를 사용자가 결정합니다"
  ],
  "ans": 2,
  "exp": "디스패처는 명확한 Deny(decision=deny인 유효 JSON, 또는 유효 JSON 없이 exit code 2)일 때만 차단합니다. 타임아웃·크래시·0/2가 아닌 exit·잘못된 stdout은 HookRunResult::Failed로 경고와 함께 통과합니다. 소스 주석은 Hook 실패가 도구 가용성을 깨지 말라고 하며, 강제는 permission 계층과 샌드박스에 맡깁니다."
 },
 {
  "g": 614,
  "type": "single",
  "q": "Sub-Agent 격리와 재개에 대해 소스 사실과 맞는 것은?",
  "opts": [
   "SubagentIsolationMode는 None·Worktree·Sandbox 세 가지 격리 모드를 제공합니다",
   "IsolationMode가 None이면 Sub-Agent가 부모 세션과 같은 컨텍스트 창을 공유합니다",
   "SubagentIsolationMode는 None과 Worktree만 있습니다. worktree 경로가 없어져도 snapshot_ref가 있으면 저장된 git ref로 다시 살릴 수 있습니다",
   "Resumed 재개 시 요청자가 모델을 자유롭게 바꿔 더 강한 모델로 이어서 작업할 수 있습니다"
  ],
  "ans": 2,
  "exp": "enum은 None과 Worktree만 있고 Sandbox 멤버는 없습니다. None은 파일·워크스페이스 격리를 말하며 서브세션 컨텍스트 창은 독립입니다. 재개 시 원본 worktree가 있으면 재사용하고, 경로가 없고 snapshot_ref만 있으면 재구축합니다. 요청의 모델 override는 soft-ignore되어 원본 모델에 고정됩니다."
 },
 {
  "g": 615,
  "type": "multi",
  "q": "도구 요청부터 제한된 실행까지의 전체 인가 체인에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "도구 입력은 먼저 AccessKind로 파싱되어 path·command·domain 세부정보를 담으며, 결정 입력은 ToolKind보다 구체적입니다",
   "권한 규칙 평가 우선순위는 규칙 출처 순서와 무관하게 deny > ask > allow입니다",
   "샌드박스가 켜져 있으면 모든 쓰기 작업이 프롬프트 없이 자동 승인됩니다",
   "Bash 스크립트는 tree-sitter로 구간을 나누며, setup이 아닌 각 구간이 독립적으로 검사를 통과해야 ls && rm이 첫 구간 승인을 타고 넘어가지 못합니다",
   "permission 계층의 Allow는 샌드박스 OS 능력도 확장하며, 두 계층이 같은 capability 표를 공유합니다"
  ],
  "ans": [0, 1, 3],
  "exp": "인가 체인은 AccessKind 파싱에서 시작해 plan 게이트·hooks·정책 규칙·세션 인가를 거칩니다. 규칙 우선순위는 deny > ask > allow로 고정입니다. ‘샌드박스면 쓰기 전부 자동 승인’은 오독입니다. 샌드박스 빠른 경로는 Bash를 특별히 보고 policy_forced_prompt·auto_forced_prompt에도 묶입니다. permission 계층은 ‘시도해도 되는지’만 정하며 Allow가 샌드박스 OS 능력을 키우지 않습니다."
 },
 {
  "g": 616,
  "type": "multi",
  "q": "Compaction two-pass 메커니즘에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "two_pass_enabled 기본값은 false이며, 명시적으로 켜지 않으면 single-pass 경로를 탑니다",
   "Pass 1은 임계값에 가까워지면 백그라운드에서 역사 prefix를 투기적으로 요약해 NOTE₁을 만듭니다",
   "Pass 2는 NOTE₁을 버리고 최근 대화 꼬리만 빠르게 요약합니다",
   "two-pass가 켜지면 실제 compaction은 NOTE₁과 최근 꼬리를 합쳐 두 번째 요약을 합니다",
   "two-pass를 켜면 자동 compaction 임계값이 85%에서 70%로 내려가 더 일찍 예열합니다"
  ],
  "ans": [0, 1, 3],
  "exp": "Two-pass는 명시 설정입니다. Pass 1이 역사 prefix를 NOTE₁으로 미리 요약하고, Pass 2가 NOTE₁과 최근 꼬리를 합쳐 다시 요약합니다. 플래그가 false면 기존 single-pass를 유지합니다. 켜도 기본 임계값 85%는 바꾸지 않으며 Pass 2가 NOTE₁을 버리지 않습니다."
 },
 {
  "g": 617,
  "type": "multi",
  "q": "기억 hybrid 검색 파이프라인에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "질의 전에 watcher가 모은 dirty Markdown 경로를 먼저 동기화합니다. 추가·수정 파일은 재인덱싱하고 삭제된 파일의 chunk는 지웁니다",
   "병합 점수는 시간 감쇠·소스 가중치·접근 이득으로 조정됩니다. 세션 기억은 반감기로 지수 감쇠하고, global·workspace 기억은 evergreen으로 취급합니다",
   "MMR 다양성 재순위는 기본 켜짐이며 lambda 0.7로 고정되어 설정할 수 없습니다",
   "FTS5 BM25와 벡터 검색이 둘 다 있어야만 파이프라인이 실행됩니다",
   "MMR은 opt-in이며 MmrConfig의 enabled 기본값은 false입니다"
  ],
  "ans": [0, 1, 4],
  "exp": "Sync-on-search로 외부 Markdown 변경이 다음 질의 전에 인덱스에 들어갑니다. 점수는 정규화 후 감쇠·소스 가중치·접근 이득으로 조정됩니다. MMR은 기본 꺼짐(enabled: false)이며 0.7 lambda는 명시적으로 켤 때만 적용됩니다. 벡터 경로는 있으면 강화이고, FTS는 항상 기본 후보를 제공하며 둘 다 있어야 한다는 제약은 없습니다."
 },
 {
  "g": 618,
  "type": "multi",
  "q": "커스텀 샌드박스 Profile과 플랫폼 실행 메커니즘에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "커스텀 profile은 기본으로 workspace를 extends하며, 네 내장 베이스는 확장할 수 있지만 off나 다른 커스텀은 확장할 수 없습니다",
   "프로젝트 .grok/sandbox.toml이 전역과 같은 이름 profile을 선언하면 merge는 entry.or_insert를 써서 전역 정의가 유지됩니다",
   "restrict_network는 메인 프로세스 네트워크도 끊기 때문에 켜면 모델 API에 접근할 수 없습니다",
   "sandbox apply가 실패하면 프로세스가 즉시 종료되어 비제한 실행이 일어나지 않습니다",
   "macOS에서 deny는 Seatbelt 규칙으로 구현되고, Linux 하위 경로 읽기 거부는 추가로 bwrap bind-over가 필요합니다"
  ],
  "ans": [0, 1, 4],
  "exp": "커스텀 extends 규칙과 entry.or_insert merge는 프로젝트가 같은 이름 전역 정책을 조용히 약화하지 못하게 합니다. 메인 프로세스 네트워크는 모델 API용으로 열려 있고, restrict_network는 서브프로세스 필터로 표현됩니다. 플랫폼 미지원이나 apply 실패 시 소스는 경고만 남기고 계속하므로 is_active()로 실제 적용 여부를 확인해야 하며 ‘우회 불가’를 보장하지 않습니다."
 },
 {
  "g": 619,
  "type": "multi",
  "q": "MCP 통합 엔지니어링 세부사항에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "등록 도구 이름은 서버 이름 + 예약 구분자 __ + 원본 도구 이름이며, 전체 이름에 구분자는 정확히 하나여야 합니다",
   "OAuth credential은 $GROK_HOME/mcp_credentials.json에 저장되며 파일 락과 원자적 저장으로 다중 프로세스 동시 쓰기를 처리합니다",
   "mcp_dispatcher는 상태 이벤트마다 즉시 ACP 알림을 밀어 UI 실시간성을 보장합니다",
   "죽은 클라이언트를 제거하기 전에 client_id를 비교해, 옛 연결의 늦은 disconnect가 새로 교체된 클라이언트를 지우지 않게 합니다",
   "stdio와 HTTP 끊김은 완전히 같은 복구 전략과 하나의 지수 백오프 타이머를 공유합니다"
  ],
  "ans": [0, 1, 3],
  "exp": "server__tool 네이밍으로 두 서버의 동명 도구가 다른 ToolId를 갖고, credential은 파일 락+원자 저장을 씁니다. 상태 이벤트는 (server_name, event_kind) 키의 50ms tumbling window에서 last-write-wins로 병합되어 고빈도 tools/list_changed도 한 번만 push됩니다. stdio 자동 재시작은 고정 1s/4s/16s 백오프이고, HTTP는 먼저 클라이언트측 복구와 독립 백오프를 쓰므로 전략이 다릅니다."
 },
 {
  "g": 620,
  "type": "judge",
  "q": "ToolKind::is_read_only()가 true인 도구는 권한 검사를 건너뛰고 자동 실행됩니다.",
  "ans": false,
  "exp": "is_read_only는 tool-kind 계층의 기본 부작용 분류일 뿐이며, 개별 도구가 자체 metadata로 override할 수 있습니다. 실제 실행 여부는 command 규칙·workspace 권한·샌드박스·hooks·사용자 승인을 여전히 통과해야 하며, 읽기 전용 분류만으로 자동 실행을 뜻하지 않습니다."
 },
 {
  "g": 621,
  "type": "judge",
  "q": "estimate_tokens의 로컬 대략 추정은 UTF-8 바이트 길이를 4로 나누며, 단일 저해상도 이미지 고정 추정은 765 토큰입니다.",
  "ans": true,
  "exp": "로컬 추정은 정확히 bytes/4 휴리스틱으로, 요청 전과 도구 출력 추가 후 빠른 예측에 쓰입니다. 저해상도 이미지 하나는 765 토큰으로 고정입니다. 서버측 usage 관측과는 별개이며, 비율·임계값 함수는 호출자가 넘긴 값만 처리하고 출처는 보지 않습니다."
 },
 {
  "g": 622,
  "type": "judge",
  "q": "플러그인 루트 trust는 Hook처럼 fail-open입니다. 플러그인 경로 해석이 실패하면 기본으로 trusted 취급해 가용성을 지킵니다.",
  "ans": false,
  "exp": "두 실패 전략은 반대입니다. 플러그인 trust는 fail-closed입니다. trust.rs에서 canonicalize 실패는 바로 false를 반환해 해석 실패를 untrusted로 두고, 미신뢰 플러그인의 hooks·MCP 서버·스크립트는 차단됩니다. Fail-open은 Hook 실행 실패 자체의 전략으로 도구 가용성을 지키기 위함입니다."
 },
 {
  "g": 623,
  "type": "judge",
  "q": "DreamLock은 best-effort 락이며, 소스 주석은 엄격한 상호 배제를 보장하지 않는다고 명시하므로 Dream 통합 프로세스는 중복 실행을 견딜 수 있게 설계되어야 합니다.",
  "ans": true,
  "exp": ".dream-lock은 PID를 저장하고 mtime을 마지막 성공 시각으로 씁니다. write-then-re-read는 경쟁 확률만 줄일 뿐 두 프로세스가 모두 이겼다고 믿을 수 있으므로 통합은 멱등해야 합니다. 쓰기 실패 롤백·성공 후에만 세션 정리·실제로 삭제된 경로만 인덱스 제거와 함께 실패 복구형 설계를 이룹니다."
 },
 {
  "g": 624,
  "type": "judge",
  "q": "Claude Code와의 비교에서 Claude 쪽 결론은 내부 소스 구현을 역공학한 결과에 기반합니다.",
  "ans": false,
  "exp": "두 열의 증거 해상도가 다릅니다. Grok Build 쪽은 소스를 파고들 수 있고, Claude Code 쪽은 공식 공개 문서에 적힌 관찰 가능한 행동만 기록하며 내부 구현을 추론하지 않고 의도적 공백을 남깁니다. 이 증거 등급 구분이 해당 절의 훈련 방법입니다."
 },
 {
  "g": 625,
  "type": "single",
  "q": "강의는 Rust 선택 이유를 ‘소스로 검증 가능한 사실’과 ‘강의 추론’으로 나눕니다. 다음 중 소스로 검증 가능한 사실은?",
  "opts": [
   "xAI가 Rust를 고른 주된 목표는 런타임 메모리 footprint를 줄이는 것이었습니다",
   "workspace.package의 edition은 2024이고, workspace 의존성은 full feature가 켜진 Tokio 1을 씁니다",
   "멀티스레드 런타임 덕분에 Grok Build가 모든 시나리오에서 유사 제품보다 빠릅니다",
   "강타입 모델링으로 팀의 결함률이 정량화 가능한 수준까지 떨어졌습니다"
  ],
  "ans": 1,
  "exp": "강의가 나열한 네 사실은 Rust 2024 edition, full feature Tokio 1, 경계 모델링에 널리 쓰인 강타입, xai-grok-pager-bin의 bin 타깃입니다. 성능 이득과 조직 동기는 소스에 없어 검증이 필요한 강의 추론으로만 표시할 수 있습니다. 합리적인 해석을 xAI 공식 동기로 쓰는 것이 바로 이 절이 경계하는 바입니다."
 },
 {
  "g": 626,
  "type": "single",
  "q": "Grok Build의 2단 Tokio 런타임 역할 분담에 대해 소스 사실과 맞는 것은?",
  "opts": [
   "진입점과 Session이 하나의 멀티스레드 런타임을 공유하며 Session은 그 안의 일반 태스크일 뿐입니다",
   "진입점은 멀티스레드 런타임을 만들고, 각 Session은 전용 OS 스레드에서 current-thread 런타임과 LocalSet을 돌리며 스택 크기는 8MB입니다",
   "진입점은 current-thread 런타임을 쓰고, Session이 도구 동시성을 위해 멀티스레드 런타임으로 승격합니다",
   "Session 스레드는 자체 런타임을 만들지 않고 호출자 스레드의 executor를 그대로 재사용합니다"
  ],
  "ans": 1,
  "exp": "진입점은 tokio::runtime::Builder::new_multi_thread().enable_all()을 씁니다. spawn_session_on_thread는 std::thread::Builder로 스레드 이름을 짓고 스택을 8 * 1024 * 1024 바이트로 둔 뒤 current-thread 런타임과 LocalSet을 만듭니다. 2단 런타임은 세션 상태를 단일 스레드에 두고 Actor 분담과 맞춰 교차 스레드 공유를 피합니다."
 },
 {
  "g": 627,
  "type": "single",
  "q": "PromptContext의 직렬화 능력과 필드 출처에 대한 설명으로 올바른 것은?",
  "opts": [
   "손으로 쓴 to_json·from_json 메서드 집합으로 직렬화합니다",
   "필드 목록은 TemplateRenderer가 런타임에 동적으로 결정합니다",
   "직렬화 능력은 Serialize·Deserialize derive에서 오고, 필드 목록은 struct 정의가 정합니다",
   "Serialize만 구현되어 디스크에서 역직렬화할 수 없습니다"
  ],
  "ans": 2,
  "exp": "struct는 Debug·Clone·Serialize·Deserialize derive를 달고 있어 직렬화 능력은 derive 자체에서 오며 전용 JSON 변환 메서드는 없습니다. 필드 목록은 struct 정의를 따르며 version·template, config·identity, 사용자 런타임 환경 세 그룹으로 나뉩니다. ToolBridge와 TemplateRenderer는 렌더링만 하고 필드 목록을 바꾸지 않습니다."
 },
 {
  "g": 628,
  "type": "single",
  "q": "TemplateOverride의 실제 변형과 기본값에 대한 설명으로 올바른 것은?",
  "opts": [
   "Default와 Custom(String)만 있으며 Default는 표준 베이스 템플릿을 가리킵니다",
   "변형은 None·Codex·Custom(String)이고 None에 #[default]가 붙어 있습니다",
   "변형은 None·Codex·Subagent·Custom(String)이며 Subagent는 compact 템플릿을 씁니다",
   "None과 Codex만 있고, 커스텀 템플릿은 설정 파일 경로로 넘깁니다"
  ],
  "ans": 1,
  "exp": "enum은 None·Codex·Custom(String)이며 #[default]는 None에 있습니다. None일 때 Primary는 표준 베이스, Subagent는 audience에 따른 compact 템플릿을 쓰며 enum에 Subagent 변형은 없습니다. Codex는 주석에 정의된 apply-patch 프로필 prompt 템플릿이고, Custom은 호출자가 넘긴 전체 템플릿 문자열을 받습니다."
 },
 {
  "g": 629,
  "type": "single",
  "q": "canonical 필드 목록에 대한 설명으로 올바른 것은?",
  "opts": [
   "여덟 필드: path, offset, limit, command, description, cwd, directory, pattern",
   "아홉 필드이며 쓰기 내용을 담는 content 필드가 추가됩니다",
   "여덟 필드이며 file_path가 읽기형 도구의 통일 필드명입니다",
   "필드 목록은 harness마다 독립적으로 확장되며 소스에 고정 상수가 없습니다"
  ],
  "ans": 0,
  "exp": "field 모듈 상수는 정확히 path·offset·limit·command·description·cwd·directory·pattern 여덟 개입니다. content canonical 필드는 없고 before/after 텍스트와 전체 쓰기 내용은 raw_input에 남는 큰 필드입니다. 정규화 계층이 file_path 같은 harness 원이름을 path로 매핑하므로 file_path는 raw 입력 이름입니다."
 },
 {
  "g": 630,
  "type": "single",
  "q": "CanonicalToolMeta의 필드와 input 생략 규칙에 대한 설명으로 올바른 것은?",
  "opts": [
   "version은 문자열 'v1'이고 input은 필수 필드입니다",
   "일곱 필드: version·name·kind·namespace·label·read_only·input. version은 숫자 1이며, 안정 투영이 없으면 input을 통째로 생략합니다",
   "input은 raw_input의 완전한 미러이며 어떤 도구 파라미터든 그 안에서 찾을 수 있습니다",
   "read_only는 호출마다 호출자가 넘기며 도구 분류와 무관합니다"
  ],
  "ans": 1,
  "exp": "TOOL_META_VERSION은 u32 값 1이고, struct 필드는 정확히 version·name·kind·namespace·label·read_only·input이며 input은 Option<serde_json::Value>입니다. canonical 투영이라 grep 플래그·replace_all 같은 비공유 필드는 빠질 수 있고 전체 raw는 raw_input에 남습니다. read_only는 도구 분류에서 오며 호출마다 호출자가 넘기지 않습니다."
 },
 {
  "g": 631,
  "type": "single",
  "q": "EffectiveRuntimeConfig의 실제 필드에 대한 설명으로 올바른 것은?",
  "opts": [
   "model·temperature·max_tokens·tools를 담아 서브세션 샘플링 파라미터를 override합니다",
   "persona와 role_prompt만 저장하며 모델 선택은 전부 부모 세션에 맡깁니다",
   "model·reasoning_effort·capability_mode·persona·persona_instructions·role_prompt·role_prompt_warning·role_name·persona_error·isolation을 담습니다",
   "AgentDefinition과 필드가 같고 타입 이름만 다릅니다"
  ],
  "ans": 2,
  "exp": "이 열 필드가 완전한 파싱 결과이며 소스에 temperature·max_tokens·tools는 없습니다. role_prompt_warning과 persona_error는 soft degradation·fail-closed 진단용입니다. AgentDefinition은 prompt_mode·tool_config·capability_mode·permission_mode·tools·isolation·model 같은 Agent 골격을 다루는 별도 계층입니다."
 },
 {
  "g": 632,
  "type": "single",
  "q": "spawn이 persona=reviewer만 지정하고, role은 model=A·capability=read-only를, Persona는 model=B를 제공합니다. merge 우선순위에 따른 최종 model과 capability_mode는?",
  "opts": [
   "model=B, capability=read-only — Persona 런타임 기본값이 최우선입니다",
   "model=A, capability=read-only — model은 role 기본값을 타고, capability는 Persona에서 읽지 않습니다",
   "model=A, capability는 비어 있음 — capability는 spawn이 명시적으로만 줄 수 있습니다",
   "model은 비어 있고 capability=read-only — spawn이 model을 안 주면 항상 부모 세션으로 돌아갑니다"
  ],
  "ans": 1,
  "exp": "우선순위는 필드별로 spawn override > role 기본값 > persona 기본값이며, 어디에도 없으면 None을 남겨 하류 상속합니다. 이 예에서 spawn이 model을 안 주므로 role의 A가 Persona의 B를 이깁니다. Persona는 model·reasoning·isolation만 주고 capability_mode는 없으므로 capability는 role의 read-only를 탑니다."
 },
 {
  "g": 633,
  "type": "single",
  "q": "Sub-Agent 해석 시 Persona instructions 파일 읽기 실패와 role의 prompt_file 읽기 실패의 차이는?",
  "opts": [
   "둘 다 경고만 남기고 계속하며 Sub-Agent는 정상 생성됩니다",
   "둘 다 생성을 중단합니다. prompt 텍스트가 없으면 서브세션 행동을 통제할 수 없기 때문입니다",
   "Persona 실패는 persona_error를 쓰고 spawn 측에서 중단합니다. role prompt 실패는 role_prompt_warning만 만들고 나머지 필드는 계속 파싱합니다",
   "Persona 실패는 기본 Persona로 폴백하고, role prompt 실패는 생성을 중단합니다"
  ],
  "ans": 2,
  "exp": "Persona는 fail-closed입니다. 찾을 수 없거나 비어 있거나 파일 읽기 실패면 persona_error를 쓰고, 파일 I/O 실패도 기본 결과로 조기 반환하며 spawn 측이 오류 시 중단합니다. Role prompt는 soft degradation으로 읽기 실패 시 role_prompt_warning만 남기고 model·reasoning·capability·isolation은 계속 파싱합니다. 두 정책 구분이 이 절의 핵심입니다."
 },
 {
  "g": 634,
  "type": "single",
  "q": "SubagentCoordinator의 기동 방식과 병렬 능력에 대해 소스 사실과 맞는 것은?",
  "opts": [
   "start_subagent_coordinator는 drain 태스크를 하나만 시작하고, 각 Spawn 이벤트는 spawn_local로 로컬 async 태스크를 띄웁니다",
   "받은 Spawn 이벤트마다 새 drain 태스크를 시작해 해당 Sub-Agent 이벤트 스트림을 격리합니다",
   "Coordinator는 Sub-Agent를 직렬로 돌리며 한 번에 하나의 서브태스크만 허용합니다",
   "병렬 Sub-Agent 최대 개수는 정의된 Persona 수와 같습니다"
  ],
  "ans": 0,
  "exp": "drain 태스크는 한 번만 시작해 이벤트를 recv하며 Spawn·Query·Cancel·ListActive·Completions 등 변형으로 분배합니다. 병렬 능력은 spawn_local로 띄운 태스크에서 오며 Persona 수와 무관합니다. Coordinator는 pending·active·completed 상태를 추적하고 오래된 completed 기록을 제거합니다."
 },
 {
  "g": 635,
  "type": "single",
  "q": "플러그인 소스 우선순위와 기본 enabled 상태에 대한 설명으로 올바른 것은?",
  "opts": [
   "어느 소스에서든 발견된 플러그인은 기본으로 enabled 목록에 들어가며 사용자가 수동으로 꺼야 합니다",
   "CLI override가 최우선입니다. project·user 범위 플러그인은 기본 disabled 목록에, CLI override와 config path는 기본 enabled 목록에 들어갑니다",
   "프로젝트 .grok/plugins가 CLI override보다 우선합니다. 프로젝트 설정이 현재 저장소에 더 가깝기 때문입니다",
   "enabled 상태는 plugin.json 필드가 선언하며 discovery 설정은 역할을 하지 않습니다"
  ],
  "ans": 1,
  "exp": "소스 순서는 CLI override → project .grok/plugins → user $GROK_HOME/plugins → registry provenance → config paths이며 CLI override가 최우선입니다. discovery 설정은 enabled·disabled 목록을 유지하고, project·user 범위는 기본 disabled, CLI override·config path는 기본 enabled이며 사용자가 명시적으로 조정할 수 있습니다. discoverable·installed·enabled·trusted는 네 독립 상태입니다."
 },
 {
  "g": 636,
  "type": "single",
  "q": "Marketplace 스캔과 플러그인 manifest 파싱에 대해 소스 사실과 맞는 것은?",
  "opts": [
   "스캐너는 plugin-index.json만 읽으며 인덱스가 없으면 빈 디렉터리를 반환합니다",
   "manifest는 플러그인 루트의 plugin.json에만 있어야 하며 다른 위치는 무시됩니다",
   "스캐너는 인덱스를 먼저 읽고, 없거나 잘못되면 plugins/*/를 스캔합니다. plugin.json이 우선 manifest 위치이며 .grok-plugin·.claude-plugin에 동명 폴백 파일이 있습니다",
   "manifest는 공유 컴포넌트 재사용을 위해 플러그인 루트 밖 경로를 선언할 수 있습니다"
  ],
  "ans": 2,
  "exp": "인덱스 우선 + 파일시스템 폴백이 발견 체인의 기본 형태이며 default-skills도 가상 플러그인으로 추가될 수 있습니다. manifest는 우선 위치 하나와 폴백 위치 둘이 있습니다. PluginManifest는 skills·commands·agents·hooks·MCP·LSP 경로를 override할 수 있지만, 파싱 후 소스가 그 경로가 플러그인 루트 안인지 검증하고 밖이면 거부합니다."
 },
 {
  "g": 637,
  "type": "single",
  "q": "캡스톤 설계 워크벤치 100점 평가 루브릭에서 가중치가 가장 높은 항목은?",
  "opts": [
   "Boundaries & ADR, 20점",
   "Contracts & State Machines, 20점",
   "Security & Recovery, 25점",
   "Demo & Evidence, 15점"
  ],
  "ans": 2,
  "exp": "루브릭은 Boundaries & ADR 20, Contracts & State Machines 20, Security & Recovery 25, Testing & Observability 20, Demo & Evidence 15이며 Security & Recovery가 가장 높습니다. 이는 아홉 차원 결정 카드 방향과 맞습니다. 실패 경로와 신뢰 경계가 기능 목록보다 완성도를 더 잘 반영합니다. 루브릭에는 거부 항목 네 개도 있어 하나라도 걸리면 자동 실패입니다."
 },
 {
  "g": 638,
  "type": "single",
  "q": "명시적 resume 요청에서 원본 transcript가 이미 대상 모델 컨텍스트 창의 90%를 차지하면 시스템은 어떻게 합니까?",
  "opts": [
   "transcript를 먼저 자동 compaction한 뒤 재개를 계속합니다",
   "재개를 거부합니다. transcript가 대상 모델 컨텍스트 창의 80%를 넘으면 소스가 거부합니다",
   "정상 재개하고, 초과분은 첫 샘플링 턴에서 서버측이 자릅니다",
   "ContextSource::New로 저하해 기록을 버리고 작업을 이어갑니다"
  ],
  "ans": 1,
  "exp": "재개 한도는 80% 임계값을 명시하며 초과 시 거부합니다. 명시적 resume은 transcript 복사·읽기 실패 시에도 fail-closed입니다. 재개는 도구 상태는 복사하지만 plan 상태·plan-mode 상태·시그널은 복사하지 않으며 원본 세션의 완전 복제가 아닙니다."
 },
 {
  "g": 639,
  "type": "single",
  "q": "MCP 도구가 등록된 뒤 모델 도구 목록에 나타날 수 있는지를 결정하는 것은?",
  "opts": [
   "서버가 tools/list로 반환하면 모델이 항상 봅니다",
   "model_visible이 결정합니다. 비활성 도구는 disabled_tool_registrations에 들어가고, ui.resourceUri가 있는 도구는 독립적으로 UI 알림을 보낼 수 있습니다",
   "BM25 인덱스 hit 점수가 결정하며 점수가 너무 낮으면 숨깁니다",
   "mcp_initialized가 결정하며 그 플래그가 true면 모든 도구가 모델 측에 들어갑니다"
  ],
  "ans": 1,
  "exp": "발견과 가시성은 별개입니다. 등록 후 model_visible이 true여야 모델측 Tool Bridge에 들어가고, 비활성 도구는 disabled_tool_registrations로, ui.resourceUri 도구는 App 측을 향합니다. BM25 인덱스는 search_tool 검색용이고 mcp_initialized는 능력 발견 완료만 알리며 둘 다 가시성 스위치가 아닙니다."
 },
 {
  "g": 640,
  "type": "single",
  "q": "소스에 열거된 15개 Hook 이벤트 중 메인 플로우를 차단할 수 있는 이벤트 유형은?",
  "opts": [
   "PreToolUse·PostToolUse·PermissionDenied 세 이벤트",
   "Pre 접두사가 있는 모든 이벤트(PreToolUse·PreCompact 포함)",
   "PreToolUse만 해당하며 is_blocking()이 true를 반환합니다",
   "15개 이벤트 모두 deny를 반환해 후속 흐름을 막을 수 있습니다"
  ],
  "ans": 2,
  "exp": "이벤트 enum은 트리거 지점을 정의하고, is_blocking()이 차단 능력을 따로 선언하며 PreToolUse만 true입니다. PreCompact·PostToolUse·PermissionDenied는 트리거되고 envelope를 받지만 메인 플로우를 멈추지 못합니다. 이벤트 목록을 읽을 때 결과가 호출자에게 어떻게 돌아가는지도 추적해야 하며, ‘이벤트가 트리거됨’이 ‘메인 플로우를 통제함’을 뜻하지 않습니다."
 },
 {
  "g": 641,
  "type": "multi",
  "q": "canonical 입력 안정 투영에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "목적은 display·telemetry·교차 도구 분석에 공유 어휘를 주는 것이며, harness마다 raw 파라미터 이름은 달라도 됩니다",
   "투영은 필드를 버릴 수 있습니다. grep 플래그·replace_all 같은 비공유 필드는 input에 안 나올 수 있습니다",
   "편집 before/after 텍스트와 전체 쓰기 내용은 call replay를 위해 input에 전부 보존됩니다",
   "쓸 안정 투영이 없으면 input을 통째로 생략합니다",
   "canonical 투영이 켜지면 중복 저장을 피하려고 raw_input을 더 이상 저장하지 않습니다"
  ],
  "ans": [0, 1, 3],
  "exp": "canonical 계층은 harness 간 공유 의미를 추구하며 안정적이고 가벼운 소수 필드만 남깁니다. 큰 필드와 비공유 필드는 투영에서 빠지고 전체 raw는 raw_input에 남아 공존합니다. input은 Option이라 쓸 것이 없으면 통째로 생략되므로 raw 입력의 미러로 읽으면 안 됩니다."
 },
 {
  "g": 642,
  "type": "multi",
  "q": "Grok Build의 멀티 Agent 조직에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "정의 계층은 AgentDefinition과 Persona로 구성되며, 전자는 prompt·도구·권한·모델·spawnable 타입의 계약을 제공합니다",
   "조율 계층 이벤트에는 Spawn·Query·Cancel·ListActive·Completions·Outstanding가 있습니다",
   "Query는 즉시 스냅샷만 반환할 수 있고 Sub-Agent 완료를 기다릴 수 없습니다",
   "Completions는 대기 중인 알림 완료 항목을 비우고 suppress_ids로 필터합니다",
   "강의는 Claude Code 소스 내부 타입으로 Coordinator와 Swarm을 모두 취급해 스케줄링 구현을 비교합니다"
  ],
  "ans": [0, 1, 3],
  "exp": "정의 계층은 Sub-Agent의 관찰 가능한 정체성과 능력 경계를 담당하고, 조율 계층은 이벤트로 생명주기를 관리합니다. Query는 즉시 스냅샷도 반환하고 block-wait 슬롯을 등록해 상태를 폴링할 수도 있어 스냅샷 전용이 아닙니다. Claude 쪽은 공개 행동만 쓰며, 강의는 Coordinator·Swarm을 그 소스 내부 타입으로 취급하지 않고 스케줄러 구현을 추론하지 않는다고 명시합니다."
 },
 {
  "g": 643,
  "type": "multi",
  "q": "플러그인 가시성에서 실행 가능성까지의 세 게이트와 증거 경계에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "MarketplaceRelativePath는 절대 경로·상위 디렉터리 탐색·범위 밖 join을 거부하며, 원격 항목은 git ref나 SHA로 내용을 찾을 수 있습니다",
   "Trust 단위는 marketplace 소스 전체이며, 같은 소스에서 설치한 플러그인이 하나의 trust 기록을 공유합니다",
   "미신뢰 플러그인의 skills·agents는 메타데이터를 목록에 올릴 수 있지만 hooks·MCP 서버·스크립트는 차단됩니다",
   "사용자 home 아래 config 경로도 개별적으로 명시 trust해야 하며 소스는 auto-trusted 경로를 두지 않습니다",
   "현재 소스는 공식 소스 상수·다중 소스·디렉터리 인덱싱·설치 흐름을 증명할 수 있지만, 플러그인 수·활성 저자·리뷰 커버리지는 소스만으로 증명할 수 없습니다"
  ],
  "ans": [0, 2, 4],
  "exp": "경로 제약·enabled 상태·실행 trust는 세 독립 게이트입니다. Trust 단위는 단일 플러그인 루트이며, 프로젝트 플러그인은 canonical plugin root로 인가되고 ~/.grok/trusted-plugins에 기록됩니다. CLI override와 user 범위 플러그인은 소스에서 trusted로 표시되고, 사용자 home 아래 config 경로는 auto-trust될 수 있으며 다른 위치는 여전히 인가가 필요합니다. 메커니즘은 증명 가능하고 생태계 규모는 아니며, 이 증거 경계도 분명히 말해야 합니다."
 },
 {
  "g": 644,
  "type": "multi",
  "q": "다섯 내장 샌드박스 Profile의 구체 능력에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "workspace는 기본 Profile이며 default_read는 true이고 서브프로세스 네트워크는 제한되지 않습니다",
   "devbox는 루트 디렉터리를 열거하고 넓은 쓰기 권한을 주되 /data는 읽기 가능하게 유지하며, Linux에서 쓰기 보호는 bwrap로 구현됩니다",
   "read-only는 restrict_network가 true이고 workspace는 쓸 수 없으며 GROK_HOME과 임시 디렉터리는 여전히 쓸 수 있습니다",
   "strict는 default_read가 true이며 workspace와의 차이는 몇 개의 추가 deny 규칙뿐입니다",
   "off는 capability-set 적용을 건너뛰고 'Sandbox disabled'를 로그하며 어떤 별칭도 받지 않습니다"
  ],
  "ans": [0, 1, 2],
  "exp": "앞 세 항목은 소스의 workspace·devbox·read-only 능력 설명과 대응하며, read-only가 운행에 필요한 최소 쓰기 디렉터리를 남긴다는 점에 유의합니다. strict의 핵심 차이는 전역 기본 읽기를 끄고 시스템 운행 디렉터리와 workspace만 연다는 것이라 default_read는 false입니다. off는 apply를 건너뛰고 'Sandbox disabled'를 로그하는 것에 더해 별칭 none을 받으며 커스텀 extends 베이스로 쓸 수 없습니다."
 },
 {
  "g": 645,
  "type": "multi",
  "q": "Dream의 실행 경계와 정리 규칙에 대해 올바른 설명을 모두 고르세요.",
  "opts": [
   "메시지 구성에는 32K 입력 한도가 있고, 모델 호출에는 30분 타임아웃이 있습니다",
   "모델이 빈 응답·NO_REPLY·Markdown 제목 없음을 반환하면 쓰기도 세션 삭제도 하지 않습니다",
   "모델 호출이 성공 반환하는 즉시 이번 실행에서 읽은 모든 세션 파일을 정리할 수 있습니다",
   "MEMORY.md 쓰기가 실패하면 rollback(prior)를 호출해 이전 락 상태를 복구합니다",
   "검색 인덱스를 통째로 재구축하며 모든 역사 세션 chunk를 한 번에 비웁니다"
  ],
  "ans": [0, 1, 3],
  "exp": "32K 입력 한도와 30분 타임아웃은 흐름에 주석된 실제 제약입니다. 성공 경계가 정리 경계를 정합니다. 세션 정리는 쓰기 성공 후에만 일어나며 최근 5분 내 활성 파일은 건너뛰므로, 모델 반환 성공만으로 정리가 트리거되지 않습니다. 인덱스는 실제로 삭제된 경로만 지운 뒤 새 MEMORY.md에 대해 인덱스와 embedding을 다시 만듭니다."
 },
 {
  "g": 646,
  "type": "judge",
  "q": "‘진입점이 Tokio 멀티스레드 런타임을 만든다’는 저장소 직접 증거가 있고, ‘xAI가 메모리 footprint를 줄이려고 Rust를 골랐다’는 직접 증거가 없어 강의 추론으로만 표시할 수 있습니다.",
  "ans": true,
  "exp": "전자는 진입점 소스에서 new_multi_thread().enable_all()을 바로 읽을 수 있는 소스 사실입니다. 후자는 기술 선택의 조직 동기이며 소스에 기록이 없습니다. 강의는 코드 형태에 기반한 해석만 주고 xAI 공식 공개 이유가 아니라고 적습니다. 모든 결론에 증거 라벨을 붙이는 것이 이 절의 훈련 목표입니다."
 },
 {
  "g": 647,
  "type": "judge",
  "q": "캡스톤 평가 루브릭은 ‘소스 코드를 인용하면서 파일 경로를 제시하지 못함’을 거부 항목으로 둡니다.",
  "ans": true,
  "exp": "거부 항목 네 가지는 제출물이 민감 데이터 착지점을 설명하지 않음, 고위험 도구에 권한 경로가 없음, 크래시 후 복구를 주장하면서 테스트가 없음, 소스를 인용하면서 파일 경로를 제시하지 못함입니다. 이는 아홉 차원 결정 카드의 소스 앵커 요구와 맞습니다. 모든 설계 결정은 실제 분기로 거슬러 올라가야 하며, 정책을 못 읽거나 결과를 못 파싱하거나 체크포인트를 못 복구할 때의 실패 기본값도 제안서에 적어야 합니다."
 },
 {
  "g": 648,
  "type": "judge",
  "q": "README는 macOS·Linux·Windows를 지원 빌드 호스트로 선언합니다.",
  "ans": false,
  "exp": "README는 지원 빌드 호스트로 macOS와 Linux만 적으며, Windows 빌드는 best-effort이고 이 소스 트리에서는 현재 테스트되지 않았습니다. 이 제한은 periodic-sync-only·외부 패치 미수용·자동 생성 루트 Cargo와 함께 공개 저장소의 경계를 이룹니다. 소스를 읽을 때 저장소 경계와 제품 능력은 따로 말해야 합니다."
 },
 {
  "g": 649,
  "type": "judge",
  "q": "exceeds_threshold_with_headroom은 비율 임계값 앞에 고정 토큰 공간을 예약해 트리거 지점을 앞당기며, context_window가 0이면 false를 반환합니다.",
  "ans": true,
  "exp": "함수는 window × threshold 결과에 saturating_sub로 headroom × 100을 빼 트리거 지점을 단순 비율보다 앞당깁니다. window 100,000·threshold 85%·headroom 4,000이면 81,000에서 트리거됩니다. window = 0 단락 분기는 exceeds_threshold와 같아 바로 false를 반환합니다."
 },
 {
  "g": 650,
  "type": "judge",
  "q": "xai-grok-tools의 namespace enum은 내장 구현 계열만 커버하며, 런타임에 발견된 MCP 도구는 이 enum에 없습니다.",
  "ans": false,
  "exp": "grok_build·grok_build_concise·grok_build_hashline·codex·opencode·memory·lsp·skills 같은 내장 계열 외에도 namespace enum에는 런타임 외부 도구용 MCP가 포함됩니다. ToolBridge의 register_mcp_tools가 MCP 도구와 input_schema를 레지스트리에 등록하며, 내장 도구와 같은 등록·분배 경로를 공유합니다."
 }
];

window.EXAM_TOPICS_PART = {
 "601": {"name": "Workspace 멤버와 축", "file": "12-1.html"},
 "602": {"name": "세 Actor 역할", "file": "12-4.html"},
 "603": {"name": "진입점과 런타임 분기", "file": "12-3.html"},
 "604": {"name": "취소와 불변성", "file": "12-4.html"},
 "605": {"name": "Compaction 기본값", "file": "12-5.html"},
 "606": {"name": "임계값 등호 경계", "file": "12-11.html"},
 "607": {"name": "도구 읽기 전용 기본값", "file": "12-8.html"},
 "608": {"name": "Preset 레지스트리 가시성", "file": "12-7.html"},
 "609": {"name": "동적 MCP 메타 도구", "file": "12-9.html"},
 "610": {"name": "검색 저하", "file": "12-12.html"},
 "611": {"name": "기억 통합 게이트", "file": "12-13.html"},
 "612": {"name": "다섯 샌드박스 Profile", "file": "12-17.html"},
 "613": {"name": "Hook 실패 의미론", "file": "12-19.html"},
 "614": {"name": "Sub-Agent 격리와 재개", "file": "12-15.html"},
 "615": {"name": "도구 인가 체인", "file": "12-18.html"},
 "616": {"name": "Two-Pass 압축", "file": "12-5.html"},
 "617": {"name": "Hybrid 검색 파이프라인", "file": "12-12.html"},
 "618": {"name": "커스텀 샌드박스 규칙", "file": "12-17.html"},
 "619": {"name": "MCP 엔지니어링 세부", "file": "12-20.html"},
 "620": {"name": "읽기 전용과 승인 경계", "file": "12-8.html"},
 "621": {"name": "토큰 로컬 추정", "file": "12-11.html"},
 "622": {"name": "플러그인 Trust 경계", "file": "12-23.html"},
 "623": {"name": "Dream 락과 멱등성", "file": "12-13.html"},
 "624": {"name": "증거 보정", "file": "12-22.html"},
 "625": {"name": "사실 vs 추론", "file": "12-2.html"},
 "626": {"name": "2단 런타임 경계", "file": "12-4.html"},
 "627": {"name": "컨텍스트 직렬화 출처", "file": "12-6.html"},
 "628": {"name": "Template Override 변형", "file": "12-6.html"},
 "629": {"name": "Canonical 필드 목록", "file": "12-10.html"},
 "630": {"name": "메타데이터 계약 버전", "file": "12-10.html"},
 "631": {"name": "Effective Runtime 필드", "file": "12-14.html"},
 "632": {"name": "필드별 Merge 우선순위", "file": "12-14.html"},
 "633": {"name": "Persona 실패 폐쇄", "file": "12-14.html"},
 "634": {"name": "Coordinator 기동", "file": "12-16.html"},
 "635": {"name": "플러그인 소스와 Enabled", "file": "12-21.html"},
 "636": {"name": "디렉터리 스캔과 Manifest", "file": "12-21.html"},
 "637": {"name": "캡스톤 루브릭 가중치", "file": "12-24.html"},
 "638": {"name": "Resume 컨텍스트 한도", "file": "12-15.html"},
 "639": {"name": "도구 모델 가시성", "file": "12-20.html"},
 "640": {"name": "Hook 차단 능력", "file": "12-19.html"},
 "641": {"name": "Canonical 투영 트레이드오프", "file": "12-10.html"},
 "642": {"name": "멀티 Agent 조율 계층", "file": "12-16.html"},
 "643": {"name": "플러그인 세 게이트", "file": "12-21.html"},
 "644": {"name": "샌드박스 Profile 능력", "file": "12-17.html"},
 "645": {"name": "Dream 성공 경계", "file": "12-13.html"},
 "646": {"name": "선택 증거 등급", "file": "12-2.html"},
 "647": {"name": "캡스톤 거부 항목", "file": "12-24.html"},
 "648": {"name": "빌드 호스트 경계", "file": "12-23.html"},
 "649": {"name": "Headroom 임계값", "file": "12-11.html"},
 "650": {"name": "Namespace 커버리지", "file": "12-9.html"}
};
