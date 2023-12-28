<script setup>
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
