import { callAvmooApi, callAvsoxApi, callAvmemoApi } from './api'

export const getAll = async () => {
  const [avmoo, avsox, avmemo] = await Promise.all([
    callAvmooApi(),
    callAvsoxApi(),
    callAvmemoApi(),
  ])

  return {
    latest_version: '2.0.0 Alpha 1',
    latest_version_code: '13',
    changelog: '',
    data_sources: [
      {
        name: 'AVMOO 日本',
        link: avmoo,
        legacies: [
          'javzoo.com',
          'avmoo.xyz',
          'avmoo.net',
          'avmoo.pw',
          'javmoo.com',
          'javlog.com',
          'javtag.com',
          'javhip.com',
          'avos.pw',
          'avmo.pw',
          'avmo.club',
          'avio.pw',
          'javdog.com',
          'javmoo.net',
        ],
      },
      {
        name: 'AVMOO 日本无码',
        link: avsox,
        legacies: [
          'avme.pw',
          'avsox.net',
          'javkey.com',
          'javfee.com',
          'javpee.com',
          'avso.pw',
          'avso.club',
        ],
      },
      {
        name: 'AVMOO 欧美',
        link: avmemo,
        legacies: [],
      },
    ],
  }
}
