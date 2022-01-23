<template>
  <div class="quill-editor">
    <div class="editor-toolbar">
      <span class="ql-formats">
        <select class="ql-font">
          <option value="NanumBarunGothic" selected></option>
          <option value="Gulim"></option>
          <option value="GulimChe"></option>
          <option value="Dotum"></option>
          <option value="DotumChe"></option>
          <option value="Batang"></option>
          <option value="BatangChe"></option>
          <option value="GungSeo"></option>
          <option value="NotoSans"></option>
          <option value="Arial"></option>
          <option value="Tahoma"></option>
          <option value="TNR"></option>
          <option value="Verdana"></option>
          <option value="CourierNew"></option>
        </select>
        <select class="ql-size">
          <option value="8pt"></option>
          <option value="9pt"></option>
          <option value="10pt" selected></option>
          <option value="11pt"></option>
          <option value="12pt"></option>
          <option value="14pt"></option>
          <option value="18pt"></option>
          <option value="24pt"></option>
          <option value="32pt"></option>
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-align" value=""></button>
        <button class="ql-align" value="center"></button>
        <button class="ql-align" value="right"></button>
        <button class="ql-align" value="justify"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <button class="ql-video"></button>
      </span>
    </div>
    <div ref="qeditor" class="editor-body"></div>
    <input
      id="hiddenImageFile"
      ref="uploadFile"
      type="file"
      accept="image/*"
      name="hiddenImageFile"
      style="display: none"
      @change="onHiddenImageFileChange"
    />
    <div
      :class="`ql-snow embed-video card ${showVideoEmbed ? 'show' : 'hide'}`"
    >
      <div class="ql-tooltip ql-editing" data-mode="video">
        <input id="ql-video" type="text" placeholder="Embed URL" />
        <a class="ql-action" @click="onClickEmbedVideo"></a>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

export default {
  props: {
    contents: { type: String, default: null },
  },
  data() {
    return {
      quill: null,
      showVideoEmbed: false,
      currentPos: 0,
    };
  },
  mounted() {
    this.quill = new this.$Quill(this.$refs.qeditor, {
      theme: 'snow',
      modules: {
        toolbar: '.editor-toolbar',
      },
    });
    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      this.$refs.uploadFile.click();
    });
    toolbar.addHandler('video', () => {
      if (this.showVideoEmbed) {
        this.onEmbedTooltipClose();
      } else {
        this.showVideoEmbed = true;
      }
      this.$jquery('.ql-editor').on('click', () => {
        this.onEmbedTooltipClose();
      });
    });
    this.quill.on('text-change', this.handleTextChange);
    if (this.contents !== null) {
      this.quill.root.innerHTML = this.contents;
    }
  },
  methods: {
    handleTextChange(delta, oldContents, source) {
      const contents =
        this.quill.root.innerHTML === '<p><br></p>'
          ? ''
          : this.quill.root.innerHTML;
      this.$emit('input', contents);

      const hasContents = this.quill.getContents().ops.some((op) => {
        const { insert } = op;
        if (typeof insert === 'string') {
          return insert.trim().length > 0;
        } else {
          return true;
        }
      });
      this.$emit('empty', !hasContents);

      const currrentContents = this.quill.getContents();
      const deletedContents = currrentContents.diff(oldContents);
      const operations = deletedContents.ops;
      operations.map((operation) => {
        // eslint-disable-next-line no-prototype-builtins
        if (operation.insert && operation.insert.hasOwnProperty('image')) {
          const { image } = operation.insert;
          this.$emit('image-removed', image);
        }
      });
      this.currentPos = this.quill.getSelection()
        ? this.quill.getSelection().index
        : 0;
    },
    onHiddenImageFileChange($event) {
      if ($event.target.files[0].size <= 1024000) {
        const files = $event.target.files || $event.dataTransfer.files;
        if (!files.length) {
          return;
        }
        const file = files[0];
        this.$emit('import-image', {
          file,
          callback: (fileName, url) => {
            this.quill.insertEmbed(
              this.quill.getSelection().index,
              'image',
              url
            );
          },
        });
      } else {
        this.showSingleButtonModal({
          message: '첨부파일의 용량을 1Mbyte이하로 해주세요.',
          description: null,
        });
      }
    },
    onClickEmbedVideo($event) {
      const convertUrls = [
        [/tv\.naver\.com\/v\//, 'tv.naver.com/embed/'],
        [/youtube\.com\/watch[?&]v=([^&]*)/, 'youtube.com/embed/$1'],
        [/youtu\.be\/([^&]*)/, 'youtube.com/embed/$1'],
      ];
      for (const key in convertUrls) {
        this.$jquery('#ql-video').val(
          this.$jquery('#ql-video')
            .val()
            .replace(convertUrls[key][0], convertUrls[key][1])
        );
      }
      this.quill.insertEmbed(
        this.currentPos,
        'video',
        this.$jquery('#ql-video').val()
      );
      this.onEmbedTooltipClose();
    },
    onEmbedTooltipClose() {
      this.showVideoEmbed = false;
      this.$jquery('#ql-video').val('');
      this.$jquery('.ql-editor').off('click');
    },
  },
};
</script>

<style scoped>
.quill-editor {
  position: relative;
}

.embed-video {
  top: 80px;
  left: 20px;
  position: absolute;
}

.embed-video.show {
  display: initial;
}

.embed-video.hide {
  display: none;
}
.editor-body {
  height: 420px;
}
</style>
