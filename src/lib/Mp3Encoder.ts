import type { AudioCodec, AudioSample } from 'mediabunny'
import type { WasmMediaEncoder } from 'wasm-media-encoders'
import { CustomAudioEncoder, EncodedPacket } from 'mediabunny'
import { createMp3Encoder } from 'wasm-media-encoders'

class Mp3Encoder extends CustomAudioEncoder {
  #encoder: WasmMediaEncoder<'audio/mpeg'> | null = null

  static supports(codec: AudioCodec): boolean {
    return codec === 'mp3'
  }

  async init(): Promise<void> {
    this.#encoder = await createMp3Encoder()
    this.#encoder.configure({
      sampleRate: 48000,
      channels: 2,
      vbrQuality: 2,
    })
  }

  supports(codec: AudioCodec): boolean {
    return codec === 'mp3'
  }

  encode(sample: AudioSample): void {
    if (!this.#encoder) {
      throw new Error('Encoder not initialized')
    }
    const audioBuffer = sample.toAudioBuffer()
    const channel0 = audioBuffer.getChannelData(0)
    const channel1 = audioBuffer.getChannelData(1) || channel0
    const packet = this.#encoder.encode([channel0, channel1])
    if (packet.length > 0) {
      this.onPacket(new EncodedPacket(packet, 'key', sample.timestamp, sample.duration))
    }
  }

  flush(): void {
    if (!this.#encoder) {
      throw new Error('Encoder not initialized')
    }
  }

  close(): void {
    if (!this.#encoder) {
      throw new Error('Encoder not initialized')
    }
  }
}

export default Mp3Encoder
