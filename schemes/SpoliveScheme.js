import LocalScheme from '@nuxtjs/auth/lib/schemes/local';

export default class SpoliveScheme extends LocalScheme {
  async login(endpoint) {
    if (!this.options.endpoints.login) {
      return;
    }
    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset();

    try {
      const { response, result } = await this.$auth.request(
        endpoint,
        this.options.endpoints.login,
        true
      );

      if (!response.data.result) {
        return response;
      }

      if (this.options.tokenRequired) {
        const token = this.options.tokenType
          ? this.options.tokenType + ' ' + result
          : result;

        this.$auth.setToken(this.name, token);
        this._setToken(token);
      }

      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  async fetchUser(endpoint) {
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return;
    }

    if (!this.options.endpoints.user) {
      this.$auth.setUser({});
      return;
    }

    try {
      const response = await this.$auth.ctx.app.$axios.$post(
        this.options.endpoints.user.url
      );
      this.$auth.setUser({
        ...response.data,
        mb_no: parseInt(response.data.mb_no),
        spoCoin: parseInt(response.data.spoCoin),
        spoGold: parseInt(response.data.spoGold),
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
