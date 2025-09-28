const buddyForm = document.querySelector('.buddy-form');
const buddyOutput = document.querySelector('.buddy-output');
const missionButtons = document.querySelectorAll('.mission-card button');
const scheduleButton = document.getElementById('generate-schedule');
const scheduleOutput = document.querySelector('.schedule-output');
const actionForm = document.querySelector('.action-form');
const actionOutput = document.querySelector('.action-output');

const tonePrompts = {
  ผจญภัย: ['สำรวจสถานีวิจัยลับ', 'ออกเดินทางข้ามกาแล็กซี', 'ช่วยฮีโร่กู้โลกการเรียนรู้'],
  'วิทย์สุดล้ำ': ['ทดลองเทคโนโลยีอนาคต', 'ออกแบบแล็บอัจฉริยะ', 'สร้างหุ่นยนต์คู่หู'],
  'ดนตรีและศิลป์': ['แต่งบทเพลงสั้น', 'ออกแบบ Moodboard', 'สร้างโชว์เคสขนาดย่อม'],
  ปริศนา: ['ไขปริศนาเชาวน์ไว', 'ถอดรหัสข้อมูลลับ', 'หาคำตอบซ่อนเร้น']
};

const missionGenerators = {
  sparks() {
    const starters = [
      topic => `ถ้าคุณได้เล่าเรื่อง ${topic} ให้เด็กอนุบาลฟัง คุณจะเริ่มต้นอย่างไร?`,
      topic => `เชื่อมโยง ${topic} กับชีวิตประจำวันของคุณได้อย่างน้อย 2 วิธีอะไรบ้าง?`,
      topic => `ลองตั้งคำถามที่ช่วยให้เพื่อน ๆ เห็นมุมใหม่ของ ${topic}`,
      topic => `คิดว่าถ้า ${topic} เป็นตัวละคร จะมีบุคลิกแบบไหน?`
    ];
    return pickMany(starters, 3);
  },
  review() {
    const cards = [
      topic => `คำสำคัญ: ${topic} คืออะไรใน 20 คำ?`,
      topic => `ภาพจำ: วาดหรือจินตนาการภาพที่แทน ${topic} แล้วอธิบาย`,
      topic => `เชื่อมโยง: ${topic} เกี่ยวข้องกับเรื่องที่เรียนมาก่อนอย่างไร?`,
      topic => `ประยุกต์ใช้: ยกตัวอย่างการใช้ ${topic} ในโลกจริง`,
      topic => `ท้าความจำ: ถ้าเหลือเวลา 1 นาที จะสรุป ${topic} ว่าอย่างไร?`,
      topic => `สัญลักษณ์จำ: เลือก emoji ที่แทน ${topic} ได้ดีที่สุด`,
      topic => `เสียงจำ: อธิบาย ${topic} ผ่านเสียงหรือจังหวะ`
    ];
    return pickMany(cards, 5);
  },
  remix() {
    const ideas = [
      topic => `ออกแบบ Minecraft Challenge ที่ใช้ ${topic} เป็นธีมหลัก`,
      topic => `สร้างสตอรี่บอร์ด TikTok 3 ฉากเพื่อเล่าเรื่อง ${topic}`,
      topic => `จับคู่ ${topic} กับอีกหนึ่งวิชาที่ต่างกัน แล้วสร้างกิจกรรมใหม่`,
      topic => `วางแผนเวิร์กช็อป 30 นาทีให้คนในชุมชนได้ลอง ${topic}`,
      topic => `คิดของรางวัลสนุก ๆ ที่สะท้อนความเข้าใจใน ${topic}`
    ];
    return pickMany(ideas, 3);
  }
};

const scheduleBlueprints = {
  revision: [
    energy => `Warm Up Focus (${energy * 5} นาที): ทบทวนจุดสำคัญด้วยแฟลชการ์ดแบบสปีดรัน`,
    () => 'Deep Practice (25 นาที): ทำแบบฝึกครูหรือโจทย์ที่เอไอจัดระดับให้',
    () => 'Reflection (10 นาที): บันทึกความก้าวหน้าและตั้งเป้าหมายรอบถัดไป'
  ],
  project: [
    energy => `Kickoff (${10 + energy * 3} นาที): สรุปสถานะโปรเจกต์และกำหนด milestone วันนี้`,
    () => 'Maker Time (35 นาที): ลงมือทำงานพร้อมคำแนะนำแบบเรียลไทม์จากเอไอ',
    () => 'Show & Share (15 นาที): อัดวิดีโอหรืออัปโหลดงานชิ้นล่าสุดเพื่อรับฟีดแบ็กจากครูและเพื่อน'
  ],
  explore: [
    energy => `Discovery Sprint (${15 + energy * 4} นาที): ดูสื่ออินเตอร์แอคทีฟหรือ VR ที่เกี่ยวข้อง`,
    () => 'Idea Lab (20 นาที): ให้เอไอช่วยแตกไอเดียคำถามเพื่อค้นคว้าต่อ',
    () => 'Capture (10 นาที): สรุปสิ่งที่ค้นพบใน Journal พร้อมเพิ่มแหล่งข้อมูลที่อยากศึกษาเพิ่ม'
  ]
};

const actionPlaybook = {
  learner: {
    must: [
      ({ time }) => `เปิดดู Mission Sparks แล้วเลือกคำถามที่อยากต่อยอดภายใน ${time} นาทีแรก`,
      () => 'อัปเดตพลังงานวันนี้ในตารางอัจฉริยะเพื่อให้เอไอปรับแผนให้อัตโนมัติ'
    ],
    vibe: {
      สร้างสรรค์: [
        () => 'ใช้ Creative Remix เพื่อสร้างงานนำเสนอขนาดย่อม 1 ชิ้น',
        ({ vibe }) => `จด 3 ไอเดียใหม่ที่ได้จากโหมด ${vibe} แล้วแชร์ใน Community Lounge`
      ],
      โฟกัส: [
        ({ time }) => `เลือกบทเรียนหลักและทำ Deep Practice อย่างน้อย ${Math.min(time, 25)} นาที`,
        () => 'สรุปสิ่งที่ได้เรียนในบันทึกเสียง 1 นาทีให้เอไอช่วยถอดใจความ'
      ],
      ชิล: [
        ({ time }) => `ทำกิจกรรมรีวิวสั้น ๆ ใน Lightning Review ไม่เกิน ${time} นาที`,
        () => 'เลือกหัวข้อที่สนใจและดูวิดีโอแนะนำจาก AI Buddy แบบสบาย ๆ'
      ]
    },
    bonus: [
      () => 'ขอฟีดแบ็กจากเพื่อนอย่างน้อย 1 คนแล้วให้เอไอช่วยสรุป',
      () => 'อัปโหลดความคืบหน้าให้ครูผ่านพอร์ตโฟลิโอ'
    ]
  },
  teacher: {
    must: [
      ({ time }) => `ดูแดชบอร์ดความก้าวหน้าของห้องเรียนภายใน ${time} นาทีเพื่อหาไฮไลต์สำคัญ`,
      () => 'อัปเดตคู่มือการสอนด้วยข้อเสนอจาก AI Buddy อย่างน้อย 1 ข้อ'
    ],
    vibe: {
      สร้างสรรค์: [
        () => 'ออกแบบกิจกรรมเกมมิฟิเคชันใหม่โดยผสม 2 ภารกิจจาก Quest Lab',
        () => 'บันทึกเสียงเกริ่นนำคาบเรียนแล้วให้เอไอแนะนำสื่อประกอบ'
      ],
      โฟกัส: [
        ({ time }) => `รีวิวคะแนนและ Insight ของนักเรียน 3 คนที่ต้องการความช่วยเหลือภายใน ${time} นาที`,
        () => 'กำหนดเป้าหมายรายสัปดาห์แล้วซิงค์กับตารางอัจฉริยะ'
      ],
      ชิล: [
        () => 'อ่านสรุปบทเรียนอัตโนมัติจากเอไอแล้วคอมเมนต์ข้อเสนอแนะสั้น ๆ',
        () => 'ส่งข้อความสร้างแรงบันดาลใจถึงคลาสผ่าน Community Lounge'
      ]
    },
    bonus: [
      () => 'บันทึกสิ่งที่ได้ผลในวันนี้ใน Journal ของครู',
      () => 'แชร์เทมเพลตการสอนของคุณให้ครูคนอื่นนำไปใช้'
    ]
  },
  mentor: {
    must: [
      ({ time }) => `ตรวจสอบ OKR ของผู้เรียนแต่ละทีมแบบรวบรัดใน ${time} นาที`,
      () => 'ตอบกลับคำถามล่าสุดใน Community Lounge พร้อมแนบแหล่งข้อมูล'
    ],
    vibe: {
      สร้างสรรค์: [
        () => 'บันทึกวิดีโอไมโครโค้ช 2 นาทีเพื่อสร้างแรงบันดาลใจ',
        () => 'จัดทำสรุปเทคนิคใหม่ที่อยากให้ทีมทดลองแล้วโพสต์ใน Quest Lab'
      ],
      โฟกัส: [
        ({ time }) => `วิเคราะห์บันทึกความคืบหน้าของทีมหลักภายใน ${time} นาที`,
        () => 'ตั้งเตือนนัดหมายโค้ชชิ่งครั้งถัดไปในปฏิทินเอไอ'
      ],
      ชิล: [
        () => 'ทักทายทีมในแชตและสอบถามสั้น ๆ ว่าต้องการความช่วยเหลืออะไร',
        () => 'อ่านสรุปการเรียนรู้ของสัปดาห์และเน้นจุดที่น่าชื่นชม'
      ]
    },
    bonus: [
      () => 'เพิ่มทรัพยากรใหม่ 1 รายการในคลังความรู้ของคลาส',
      () => 'สะท้อนสิ่งที่เรียนรู้จากการโค้ชในวันนี้ 3 บรรทัด'
    ]
  }
};

buddyForm.addEventListener('submit', event => {
  event.preventDefault();
  const topic = buddyForm.topic.value.trim();
  const tone = buddyForm.tone.value;
  const duration = Number(buddyForm.duration.value || 45);

  if (!topic) {
    buddyOutput.innerHTML = '<p>กรอกหัวข้อก่อนนะ!</p>';
    return;
  }

  const toneIdeas = tonePrompts[tone];
  const prompt = toneIdeas[Math.floor(Math.random() * toneIdeas.length)];

  const segments = [
    `<h3>กิจกรรม: ${topic}</h3>`,
    `<p><strong>ธีม:</strong> ${tone} | <strong>เวลา:</strong> ${duration} นาที</p>`,
    `<p>เริ่มด้วยการ ${prompt} แล้วให้ผู้เรียนจับคู่ข้อมูลจาก AI Knowledge Cards เพื่อสร้างเรื่องเล่าเกี่ยวกับ <strong>${topic}</strong>.</p>`,
    '<p>จบด้วย Mini Challenge: ผู้เรียนบันทึกเสียง/วิดีโออธิบายสิ่งที่ได้เรียนรู้ และ AI จะช่วยสรุปไฮไลต์ให้ทันที</p>'
  ];

  buddyOutput.innerHTML = segments.join('');
});

missionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const mission = button.dataset.mission;
    const topic = buddyForm.topic.value.trim() || 'หัวข้อที่สนใจ';
    const generator = missionGenerators[mission];
    const results = generator().map(fn => `<li>${fn(topic)}</li>`).join('');
    document.getElementById(`mission-${mission}`).innerHTML = results;
  });
});

scheduleButton.addEventListener('click', () => {
  const energy = Number(document.getElementById('energy').value);
  const goal = document.getElementById('goal').value;
  const blueprint = scheduleBlueprints[goal];

  const scheduleItems = blueprint.map(step => step(energy));
  scheduleOutput.innerHTML = scheduleItems
    .map((item, index) => `<li><strong>ช่วงที่ ${index + 1}:</strong> ${item}</li>`)
    .join('');
});

if (actionForm) {
  actionForm.addEventListener('submit', event => {
    event.preventDefault();
    const role = actionForm.role.value;
    const time = Number(actionForm.time.value);
    const vibe = actionForm.vibe.value;

    const context = { time, vibe };
    const play = actionPlaybook[role];

    const mustDo = play.must.map(task => task(context));
    const vibeTasks = pickMany(play.vibe[vibe], 2).map(task => task(context));
    const bonusTask = pickMany(play.bonus, 1).map(task => task(context));

    const tasks = [...mustDo, ...vibeTasks, ...bonusTask];
    actionOutput.innerHTML = tasks.map(task => `<li>${task}</li>`).join('');
  });
}

function pickMany(source, amount) {
  const copy = [...source];
  const result = [];
  while (result.length < amount && copy.length) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

// สร้างค่าตั้งต้นให้หน้าเว็บดูมีชีวิตตั้งแต่เริ่มโหลด
buddyOutput.innerHTML = `<h3>เริ่มต้นกับ AI Study Buddy</h3>\n<p>กรอกหัวข้อแล้วให้เอไอช่วยสร้างกิจกรรมที่ออกแบบเพื่อคุณ!</p>`;

scheduleOutput.innerHTML = `<li><strong>ช่วงที่ 1:</strong> Warm Up Focus (15 นาที): ลองสำรวจหัวข้อที่คุณสนใจผ่าน Quiz สั้น ๆ</li>\n<li><strong>ช่วงที่ 2:</strong> Idea Lab (20 นาที): ใช้ AI Buddy เพื่อแตกไอเดียต่อยอด</li>\n<li><strong>ช่วงที่ 3:</strong> Chill Reflect (10 นาที): จดบันทึกสิ่งที่ค้นพบและแชร์ใน Community Lounge</li>`;

if (actionOutput) {
  actionOutput.innerHTML = `
    <li>สำรวจ Quest Lab แล้วเลือกกิจกรรมที่อยากเริ่มในวันนี้</li>
    <li>กำหนดเวลาว่างลงในตารางอัจฉริยะเพื่อให้เอไอช่วยติดตาม</li>
    <li>แชร์เป้าหมายสั้น ๆ ใน Community Lounge เพื่อรับแรงสนับสนุน</li>
  `;
}
