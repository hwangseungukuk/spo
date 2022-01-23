import { createNamespacedHelpers } from 'vuex';

const {
  mapState: _fileUploadState,
  mapActions: _fileUploadActions,
} = createNamespacedHelpers('community/file/upload');

const { mapActions: _fileDeleteActions } = createNamespacedHelpers(
  'community/file/delete'
);

export default {
  computed: {
    ..._fileUploadState({
      _fileUploaded: 'success',
      _fileMessage: 'message',
      _fileError: 'error',
    }),
  },
  _fileError(v) {
    if (v === null) {
      return;
    }
    this.showSingleButtonModal({
      message: '이미지를 업로드 할 수 없습니다.',
      description: '오류가 발생하였습니다.',
      onConfirm: () => {
        this.clearImageState();
      },
    });
  },
  _fileMessage(v) {
    if (v === null) {
      return;
    }
    this.showSingleButtonModal({
      message: '이미지를 업로드 할 수 없습니다.',
      description: v,
      onConfirm: () => {
        this.clearImageState();
      },
    });
  },
  methods: {
    ..._fileUploadActions({ imageUpload: 'upload', clearImageState: 'clear' }),
    ..._fileDeleteActions({ imageDelete: 'delete' }),
  },
};
