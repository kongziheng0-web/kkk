// ====== 基础数据 ======
let state = {
  systemName: "小恒家厨房",
  bannerImg: "",
  userAvatar: "",
  foods: [],
  filteredFoods: [],
  myMenu: [],
  customFoods: [],
  currentFood: null,
  activeTab: 0
};

// ====== 内置菜品（简化版，可替换你 data）======
const defaultFoods = [
  {
    id: 1,
    name: "番茄炒蛋",
    category: "热菜",
    pic: "",
    desc: "经典家常菜",
    cookTime: 10,
    difficulty: "简单",
    calorie: "150kcal",
    ingredients: [
      { name: "番茄", unit: "2个" },
      { name: "鸡蛋", unit: "3个" }
    ],
    steps: ["炒蛋", "炒番茄", "混合"]
  },
  {
    id: 2,
    name: "酸辣土豆丝",
    category: "热菜",
    pic: "",
    desc: "酸辣开胃",
    cookTime: 8,
    difficulty: "简单",
    calorie: "90kcal",
    ingredients: [
      { name: "土豆", unit: "2个" }
    ],
    steps: ["切丝", "翻炒", "调味"]
  }
];

// ====== 初始化 ======
window.onload = function () {
  loadLocal();
  initData();
  renderFood();
  goPage("home");
};

// ====== 初始化数据 ======
function initData() {
  state.foods = [...defaultFoods, ...state.customFoods];
  state.filteredFoods = state.foods;

  document.getElementById("system-name").innerText = state.systemName;
  document.getElementById("mine-name").innerText = state.systemName;

  if (state.userAvatar) {
    document.getElementById("avatar").style.backgroundImage = `url(${state.userAvatar})`;
  }
}

// ====== 页面切换 ======
function goPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");

  // tabbar状态
  document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));

  if (page === "home") document.querySelectorAll(".tab-item")[0].classList.add("active");
  if (page === "menu") document.querySelectorAll(".tab-item")[1].classList.add("active");
  if (page === "mine") document.querySelectorAll(".tab-item")[2].classList.add("active");

  if (page === "menu") renderMenu();
}

// ====== 渲染菜品 ======
function renderFood() {
  const list = document.getElementById("food-list");
  list.innerHTML = "";

  state.filteredFoods.forEach(food => {
    const div = document.createElement("div");
    div.className = "food-card";
    div.onclick = () => openDetail(food);

    div.innerHTML = `
      <div class="food-img" style="background:#eee"></div>
      <div class="food-info">
        <h3>${food.name}</h3>
        <div class="food-tags">
          <span class="tag orange">${food.cookTime}分钟</span>
          <span class="tag blue">${food.difficulty}</span>
        </div>
        <div class="like">🔥 ${food.calorie}</div>
      </div>
    `;
    list.appendChild(div);
  });
}

// ====== 分类切换 ======
function switchTab(index) {
  state.activeTab = index;

  const categories = ["主食", "热菜", "凉菜", "汤类", "饮料"];
  const cate = categories[index];

  state.filteredFoods = state.foods.filter(f => f.category === cate);
  renderFood();
}

// ====== 搜索 ======
function searchFood() {
  const val = document.getElementById("search-input").value;

  state.filteredFoods = state.foods.filter(f =>
    f.name.includes(val)
  );

  renderFood();
}

// ====== 随机推荐 ======
function randomFood() {
  const food = state.foods[Math.floor(Math.random() * state.foods.length)];

  alert("今晚推荐：" + food.name);
  openDetail(food);
}

// ====== 打开详情 ======
function openDetail(food) {
  state.currentFood = food;

  goPage("detail");

  document.getElementById("detail-name").innerText = food.name;
  document.getElementById("detail-time").innerText = food.cookTime;
  document.getElementById("detail-diff").innerText = food.difficulty;
  document.getElementById("detail-cal").innerText = food.calorie;
  document.getElementById("detail-desc").innerText = food.desc;

  // 食材
  const ing = document.getElementById("detail-ing");
  ing.innerHTML = "";
  food.ingredients.forEach(i => {
    ing.innerHTML += `<p>${i.name} - ${i.unit}</p>`;
  });

  // 步骤
  const steps = document.getElementById("detail-steps");
  steps.innerHTML = "";
  food.steps.forEach((s, i) => {
    steps.innerHTML += `<p>${i + 1}. ${s}</p>`;
  });
}

// ====== 加入菜单 ======
function addMenu() {
  if (!state.currentFood) return;

  const exists = state.myMenu.find(i => i.id === state.currentFood.id);
  if (!exists) {
    state.myMenu.push(state.currentFood);
    saveLocal();
    alert("已加入菜单");
  } else {
    alert("已经在菜单中了");
  }
}

// ====== 菜单渲染 ======
function renderMenu() {
  const box = document.getElementById("menu-list");
  box.innerHTML = "";

  state.myMenu.forEach(food => {
    const div = document.createElement("div");
    div.className = "menu-food";

    div.innerHTML = `
      <div>
        <h4>${food.name}</h4>
        <p>${food.cookTime}分钟</p>
      </div>
    `;
    box.appendChild(div);
  });
}

// ====== 清空菜单 ======
function clearMenu() {
  state.myMenu = [];
  saveLocal();
  renderMenu();
}

// ====== 买菜清单 ======
function showShopping() {
  const map = {};

  state.myMenu.forEach(food => {
    food.ingredients.forEach(i => {
      map[i.name] = (map[i.name] || 0) + 1;
    });
  });

  let text = "";
  Object.keys(map).forEach(k => {
    text += `${k} x ${map[k]}\n`;
  });

  alert("买菜清单：\n\n" + text);
}

// ====== 做饭顺序 ======
function cookOrder() {
  let total = 0;

  state.myMenu.forEach(i => total += i.cookTime);

  alert("预计总耗时：" + total + "分钟");
}

// ====== 修改头像 ======
function changeAvatar() {
  const url = prompt("输入头像图片链接");
  if (url) {
    state.userAvatar = url;
    document.getElementById("avatar").style.backgroundImage = `url(${url})`;
    saveLocal();
  }
}

// ====== 设置保存 ======
function saveSetting() {
  const name = document.getElementById("set-name").value;
  if (name) {
    state.systemName = name;
    document.getElementById("system-name").innerText = name;
    document.getElementById("mine-name").innerText = name;
    saveLocal();
    alert("保存成功");
  }
}

// ====== 添加自定义菜 ======
function addCustomFood() {
  const name = document.getElementById("add-name").value;
  const cate = document.getElementById("add-cate").value;
  const time = document.getElementById("add-time").value;
  const ing = document.getElementById("add-ing").value;

  const food = {
    id: Date.now(),
    name,
    category: cate,
    cookTime: Number(time),
    difficulty: "自定义",
    calorie: "未知",
    ingredients: ing.split(",").map(i => ({ name: i, unit: "" })),
    steps: ["用户自定义"]
  };

  state.customFoods.push(food);
  state.foods.push(food);

  saveLocal();
  alert("添加成功");
}

// ====== 本地存储 ======
function saveLocal() {
  localStorage.setItem("food_app", JSON.stringify(state));
}

function loadLocal() {
  const data = localStorage.getItem("food_app");
  if (data) {
    state = JSON.parse(data);
  }
}