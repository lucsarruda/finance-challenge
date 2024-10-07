
import { ChatMockApi } from 'app/mock-api/apps/chat/api';
import { ContactsMockApi } from 'app/mock-api/apps/contacts/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { transactionsMockApi } from './transactions/api';
import { AuthMockApi } from './common/auth/api';
import { UserMockApi } from './common/user/api';

export const mockApiServices = [
    AuthMockApi,
    ChatMockApi,
    ContactsMockApi,
    MessagesMockApi,
    NotificationsMockApi,
    ShortcutsMockApi,
    transactionsMockApi,
    NavigationMockApi,
    UserMockApi

];
