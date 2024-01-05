<script setup>
//Import Froala Editor
import 'froala-editor/js/plugins.pkgd.min.js';
//Import third party plugins
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/languages/zh_cn.js'
// Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
const config = {
  placeholderText: '请在此输入',
  language: 'zh_cn', //语言
  quickInsertEnabled: false, //快速插入
  toolbarButtons: [
    'undo',
    'redo',
    'clearFormatting',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'fontFamily',
    'fontSize',
    'color',
    // 'inlineStyle',
    // 'paragraphFormat',
    'align',
    // 'formatOL',
    // 'formatUL',
    'outdent',
    'indent',
    'quote',
    'insertLink',
    // 'insertImage',
    // 'insertVideo',
    // 'embedly',
    // 'insertFile',
    'insertTable',
    'emoticons',
    'specialCharacters',
    // 'insertHR',
    // 'selectAll',
    // 'print',
    // 'spellChecker',
    'html',
    'help',
    // 'fullscreen',
  ],
  events: {
    initialized: function () {
    }
  }
}
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <froala id="edit" :tag="'textarea'" :value="modelValue" @update:value="$emit('update:modelValue',$event)" :config="config" v-bind="$attrs"></froala>
</template>
