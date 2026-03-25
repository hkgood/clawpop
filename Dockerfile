# ClawPop Docker 测试环境
# 用于在隔离环境中测试 ClawPop 的后端功能
FROM node:22-bookworm

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    git \
    rustup \
    && rm -rf /var/lib/apt/lists/*

# 安装 Rust (Tauri 需要)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
ENV PATH="/root/.cargo/bin:${PATH}"

# 工作目录
WORKDIR /app

# 复制项目文件
COPY package*.json ./
COPY src-tauri ./src-tauri/
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY tsconfig*.json ./
COPY index.html ./

# 安装 npm 依赖
RUN npm install

# 构建 Tauri (release 模式用于测试)
# RUN cd src-tauri && cargo build --release

# 默认命令：进入 shell
CMD ["/bin/bash"]