#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
复制 graphic 目录下的模块到 node_modules 对应目录
"""

import os
import shutil
import sys
from pathlib import Path


def count_files(directory):
    """统计目录下的文件总数"""
    total = 0
    for root, dirs, files in os.walk(directory):
        total += len(files)
    return total


def copy_with_progress(src, dst, progress_state):
    """
    带进度显示的复制函数
    :param src: 源文件路径
    :param dst: 目标文件路径
    :param progress_state: 进度状态字典 {'current': int, 'total': int, 'name': str}
    """
    # 确保目标目录存在
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    # 覆盖已有文件
    shutil.copy2(src, dst)
    
    progress_state['current'] += 1
    current = progress_state['current']
    total = progress_state['total']
    name = progress_state['name']
    percent = (current / total * 100) if total > 0 else 100
    
    # 进度条
    bar_length = 30
    filled = int(bar_length * current / total) if total > 0 else bar_length
    bar = '█' * filled + '░' * (bar_length - filled)
    
    sys.stdout.write(f'\r[{name}] |{bar}| {percent:.1f}% ({current}/{total} 文件)')
    sys.stdout.flush()


def copy_directory(src, dst, name):
    """
    复制目录，目标存在也继续覆盖文件，带进度显示
    :param src: 源目录路径
    :param dst: 目标目录路径
    :param name: 模块名称,用于进度显示
    :return: True
    """
    total_files = count_files(src)
    print(f"\n复制: {name} ({total_files} 个文件)")
    print(f"  {src} -> {dst}")

    # 目标目录已存在提示
    if os.path.exists(dst):
        print(f"  目标目录已存在，将覆盖内部文件")

    progress_state = {'current': 0, 'total': total_files, 'name': name}

    def progress_copy(src_file, dst_file):
        return copy_with_progress(src_file, dst_file, progress_state)

    # 递归复制，目录存在也继续执行
    shutil.copytree(src, dst, copy_function=progress_copy, dirs_exist_ok=True)
    print()  # 换行
    return True


def main():
    # 获取当前脚本所在目录 (frontend)
    current_dir = Path(__file__).parent
    
    # 定义路径
    node_modules_dir = current_dir / "node_modules"
    graphic_dir = current_dir / "graphic"
    
    # 1. 检查并创建 node_modules 目录
    if not os.path.exists(node_modules_dir):
        print(f"创建目录: {node_modules_dir}")
        os.makedirs(node_modules_dir)
    else:
        print(f"目录已存在: {node_modules_dir}")
    
    # 2. 复制 graphic-editor 到 @x-plateform
    graphic_editor_src = graphic_dir / "graphic-editor"
    graphic_editor_dst = node_modules_dir / "@x-plateform" / "graphic-editor"

    if os.path.exists(graphic_editor_src):
        copy_directory(graphic_editor_src, graphic_editor_dst, "graphic-editor")
    else:
        print(f"\n警告: 源目录不存在: {graphic_editor_src}")
    
    print("\n复制完成!")


if __name__ == "__main__":
    main()