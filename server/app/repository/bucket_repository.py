import os
from supabase import create_client, Client


class BucketRepository:
    def __init__(self):
        url: str = os.environ.get('SUPABASE_URL')
        key: str = os.environ.get('SUPABASE_KEY')
        self.supabase: Client = create_client(url, key)

    def upload_signature(self, name: str, binary: bytes, content_type: str = 'text/plain') -> str:
        self.supabase.storage.from_('signatures').upload(
            name, binary, file_options={'content-type': content_type})

        self.supabase.table('uploads').insert(
            {'name': name, 'type': 'signature'}).execute()

        return self.supabase.storage.from_('signatures').get_public_url(name)
